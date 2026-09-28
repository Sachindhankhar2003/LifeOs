// Extensible delivery adapters for Notifications

export async function deliverEmail(to: string, subject: string) {
  // In production, integrate with SendGrid, Resend, or AWS SES.
  // We do not claim this works unless fully configured.
  const apiKey = process.env.EMAIL_PROVIDER_API_KEY;
  if (!apiKey) {
    console.log(`[DELIVERY] Email delivery skipped for ${to} (No API key configured)`);
    return false;
  }
  
  // Example integration point
  console.log(`[DELIVERY] Sending email to ${to}: ${subject}`);
  return true;
}

export async function deliverWebPush(userId: string, title: string) {
  // In production, integrate with Web Push standard or a service like Firebase Cloud Messaging / OneSignal.
  const vapidKey = process.env.VAPID_PUBLIC_KEY;
  if (!vapidKey) {
    console.log(`[DELIVERY] Web Push delivery skipped for user ${userId} (No VAPID keys)`);
    return false;
  }

  // Example integration point
  console.log(`[DELIVERY] Sending web push to user ${userId}: ${title}`);
  return true;
}
