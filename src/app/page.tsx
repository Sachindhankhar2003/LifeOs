import Link from "next/link";
import { ArrowRight, Brain, Target, Compass, Sparkles } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center bg-white">
      {/* Navigation */}
      <nav className="w-full max-w-7xl px-6 py-6 flex items-center justify-between border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <span className="font-semibold text-xl tracking-tight text-slate-900">LifeOS</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="#features" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
            Features
          </Link>
          <Link href="#how-it-works" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
            How it works
          </Link>
          <Link
            href="/dashboard"
            className="text-sm font-medium px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            Go to App
          </Link>
        </div>
      </nav>

      <main className="w-full flex flex-col items-center flex-1">
        {/* Hero Section */}
        <section className="w-full max-w-5xl px-6 py-24 md:py-32 flex flex-col items-center text-center">
          <div className="px-3 py-1 text-xs font-semibold tracking-wide text-blue-600 bg-blue-50 border border-blue-200 rounded-full mb-8 inline-flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
            Introducing LifeOS 1.0
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 mb-6 max-w-4xl text-balance">
            Your personal decision simulator and life planner.
          </h1>
          <p className="text-lg md:text-xl text-slate-500 mb-10 max-w-2xl text-balance">
            Model the consequences of major life choices before you make them. Plan goals, track progress, and map out your realistic constraints with an AI co-pilot.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mb-20 md:mb-32">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md shadow-blue-200"
            >
              Start Planning Now
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="#how-it-works"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-slate-700 rounded-xl font-medium border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors"
            >
              See How It Works
            </Link>
          </div>

          {/* Product Preview */}
          <div className="w-full max-w-6xl w-full border border-slate-200/60 bg-slate-50/50 rounded-2xl p-2 md:p-4 shadow-sm">
            <div className="w-full aspect-[16/9] md:aspect-[21/9] bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden flex flex-col relative">
              <div className="h-12 border-b border-slate-100 flex items-center px-4 gap-4 bg-slate-50/50">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                  <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                  <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                </div>
                <div className="h-6 w-48 bg-white border border-slate-200 rounded-md"></div>
              </div>
              <div className="flex-1 p-6 flex gap-6">
                <div className="w-48 hidden md:flex flex-col gap-3 border-r border-slate-100 pr-4">
                  <div className="h-8 bg-slate-100 rounded-md w-full"></div>
                  <div className="h-8 bg-slate-50 rounded-md w-3/4"></div>
                  <div className="h-8 bg-slate-50 rounded-md w-5/6"></div>
                  <div className="h-8 bg-slate-50 rounded-md w-4/5"></div>
                </div>
                <div className="flex-1 flex flex-col gap-4">
                  <div className="h-10 bg-slate-100 rounded-lg w-1/3"></div>
                  <div className="flex gap-4 mb-4">
                    <div className="flex-1 bg-white border border-slate-100 rounded-xl p-4 shadow-sm h-32 flex flex-col gap-2">
                       <div className="w-8 h-8 rounded bg-blue-50 mb-2"></div>
                       <div className="h-4 bg-slate-100 rounded w-1/2"></div>
                       <div className="h-4 bg-slate-50 rounded w-1/3"></div>
                    </div>
                    <div className="flex-1 bg-white border border-slate-100 rounded-xl p-4 shadow-sm h-32 flex flex-col gap-2">
                       <div className="w-8 h-8 rounded bg-slate-50 mb-2"></div>
                       <div className="h-4 bg-slate-100 rounded w-1/2"></div>
                       <div className="h-4 bg-slate-50 rounded w-1/3"></div>
                    </div>
                    <div className="flex-1 bg-white border border-slate-100 rounded-xl p-4 shadow-sm h-32 flex flex-col gap-2">
                       <div className="w-8 h-8 rounded bg-slate-50 mb-2"></div>
                       <div className="h-4 bg-slate-100 rounded w-1/2"></div>
                       <div className="h-4 bg-slate-50 rounded w-1/3"></div>
                    </div>
                  </div>
                  <div className="flex-1 bg-white border border-slate-100 rounded-xl p-4 shadow-sm flex flex-col gap-4">
                     <div className="h-6 bg-slate-100 rounded w-1/4"></div>
                     <div className="h-4 bg-slate-50 rounded w-full"></div>
                     <div className="h-4 bg-slate-50 rounded w-5/6"></div>
                     <div className="h-4 bg-slate-50 rounded w-4/5"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full bg-slate-50 border-t border-slate-100">
          <div className="w-full max-w-7xl mx-auto px-6 py-24 md:py-32">
            <div className="mb-16">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-4">
                Everything you need to plan ahead.
              </h2>
              <p className="text-lg text-slate-500 max-w-2xl">
                A structured environment to organize your thoughts, test assumptions, and take actionable steps forward.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-start text-left hover:shadow-md hover:-translate-y-0.5 transition-all">
                <div className="mb-6 p-4 rounded-xl bg-linear-to-br from-blue-50 to-indigo-50 text-blue-600 block">
                  <Compass className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Decision Simulator</h3>
                <p className="text-slate-500 leading-relaxed text-sm">
                  Run through major life scenarios. Compare trade-offs, identify constraints, and get an objective analysis of multiple paths.
                </p>
              </div>
              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-start text-left hover:shadow-md hover:-translate-y-0.5 transition-all">
                <div className="mb-6 p-4 rounded-xl bg-linear-to-br from-orange-50 to-amber-50 text-orange-600 block">
                  <Target className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Goal Tracking</h3>
                <p className="text-slate-500 leading-relaxed text-sm">
                  Deconstruct large ambitions into manageable milestones. Track your progress daily without feeling overwhelmed.
                </p>
              </div>
              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-start text-left hover:shadow-md hover:-translate-y-0.5 transition-all">
                <div className="mb-6 p-4 rounded-xl bg-linear-to-br from-violet-50 to-purple-50 text-violet-600 block">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">AI Co-Pilot</h3>
                <p className="text-slate-500 leading-relaxed text-sm">
                  Chat with an AI designed to ask the hard questions. Clarify your thinking and avoid cognitive biases in real-time.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer CTA */}
        <section className="w-full max-w-7xl mx-auto px-6 py-24 md:py-32 flex flex-col items-center text-center">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 mb-6">
            Ready to design your future?
          </h2>
          <p className="text-lg text-slate-500 mb-10 max-w-2xl">
            Start structuring your life goals and major decisions today with LifeOS. No clutter, just clarity.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-200"
          >
            Open LifeOS
            <ArrowRight className="w-5 h-5" />
          </Link>
        </section>
      </main>
      
      <footer className="w-full border-t border-slate-100 py-8 text-center text-slate-400 text-sm flex items-center justify-center gap-2">
        <Brain className="w-4 h-4" /> LifeOS © {new Date().getFullYear()} — Built for clarity.
      </footer>
    </div>
  );
}
