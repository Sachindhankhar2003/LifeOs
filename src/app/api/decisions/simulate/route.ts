import { generateObject, generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { aiTools } from "@/lib/tools";
import { trackEvent } from "@/lib/rbac";

export const maxDuration = 30;

const simulationResultSchema = z.object({
  options: z.array(z.object({
    id: z.string(),
    title: z.string(),
    likelihood: z.enum(["High", "Medium", "Low"]),
    riskLevel: z.enum(["High Risk", "Medium Risk", "Low Risk"]),
    stability: z.enum(["High Stability", "Medium Stability", "Low Stability"]),
    outcome: z.string().describe("1 year realistic outcome"),
    pros: z.array(z.string()),
    cons: z.array(z.string()),
    recommended: z.boolean()
  })),
  criticalAssumption: z.string().describe("Identify the biggest assumption or missing information in the user's inputs"),
  nextSteps: z.array(z.string()).describe("Actionable next steps to validate assumptions"),
  intelUsed: z.array(z.object({
    source: z.string(),
    summary: z.string()
  })).optional().describe("Summary of external live data used for this simulation, if any")
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { decision, budget, deadline, options, useLiveIntel } = body;

    if (!decision || !options || !Array.isArray(options)) {
      return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
    }

    let externalContext = "";
    let toolUsageRaw: any[] = [];

    // Optional Real-World Intelligence Layer
    if (useLiveIntel) {
      const grounding = await generateText({
        model: openai("gpt-4o") as any,
        system: "You are a data retrieval agent. If the user's decision context implies needing weather or financial exchange rates, call the appropriate tools. Examples: if moving to a specific city, fetch weather for general info. If budgeting in different currencies, fetch exchange rates. If no tools seem relevant, output 'No tools needed'.",
        prompt: `Decision: ${decision}\nBudget constraint: ${budget}\nDeadline: ${deadline}\nOptions: ${options.map((opt:any)=>opt.title).join(", ")}`,
        tools: aiTools,
        maxSteps: 3,
      });

      if (grounding.toolResults && grounding.toolResults.length > 0) {
        externalContext = "\nLIVE EXTERNAL DATA RETRIEVED:\n" + grounding.toolResults.map(tr => 
           `Tool [${tr.toolName}]: ${JSON.stringify(tr.result)}`
        ).join("\n");
        toolUsageRaw = grounding.toolResults;
      }
    }

    const { object } = await generateObject({
      model: openai("gpt-4o") as any,
      schema: simulationResultSchema,
      prompt: `You are a practical personal decision simulator. 
Analyze the following decision realistically, mapping out trade-offs, likelihoods, and assumptions.
Do not guarantee rosy outcomes. Be grounded. Identify missing information.
${externalContext}

Decision: ${decision}
Budget constraint: ${budget || "None"}
Deadline: ${deadline || "None"}
Options: 
${options.map((opt: any, i: number) => `Option ${i + 1} (ID: ${opt.id}): ${opt.title}`).join("\n")}
`
    });

    await trackEvent("SIMULATION_COMPLETED", session.user.id);

    return NextResponse.json({
      ...(object as any),
      _rawIntel: toolUsageRaw // Send raw intel so UI can determine sources & freshness
    });
  } catch (error: any) {
    console.error("Simulation API Error:", error);
    return NextResponse.json({ error: "Simulation failed. Please try again later." }, { status: 500 });
  }
}
