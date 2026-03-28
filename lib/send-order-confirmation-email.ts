import { Resend } from "resend";

import { getSiteUrl } from "@/lib/site";

export type OrderConfirmationInput = {
  to: string;
  customerName?: string | null;
  sessionId: string;
  amountTotal: number | null;
  currency: string | null;
};

function formatAmount(cents: number | null, currency: string | null): string {
  if (cents == null) return "";
  const cur = (currency ?? "usd").toUpperCase();
  if (cur === "USD") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(cents / 100);
  }
  return `${(cents / 100).toFixed(2)} ${cur}`;
}

/**
 * Sends a transactional email after checkout. Requires RESEND_API_KEY and
 * RESEND_FROM (e.g. "ShadowSend <orders@yourdomain.com>").
 * Header image: {site}/email/thank-you.png (replace with your own asset).
 */
export async function sendOrderConfirmationEmail(
  input: OrderConfirmationInput,
): Promise<{ ok: true } | { ok: false; reason: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM?.trim();
  if (!apiKey) {
    return { ok: false, reason: "RESEND_API_KEY is not set" };
  }
  if (!from) {
    return { ok: false, reason: "RESEND_FROM is not set" };
  }

  const site = getSiteUrl();
  const imageUrl = `${site}/email/thank-you.png`;
  const greeting = input.customerName?.trim()
    ? `Hi ${input.customerName.trim()},`
    : "Hi,";
  const amountLine = formatAmount(input.amountTotal, input.currency);

  const html = `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:24px;font-family:system-ui,-apple-system,sans-serif;font-size:16px;line-height:1.5;color:#1f2937;background:#f9fafb;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;">
    <tr>
      <td style="padding-bottom:20px;">
        <img src="${imageUrl}" alt="ShadowSend" width="600" style="display:block;width:100%;max-width:600px;height:auto;border-radius:8px;" />
      </td>
    </tr>
    <tr>
      <td style="background:#fff;padding:28px;border-radius:12px;border:1px solid #e5e7eb;">
        <p style="margin:0 0 16px;">${greeting}</p>
        <p style="margin:0 0 16px;">Thank you for your order. We received your payment${
          amountLine ? ` of <strong>${amountLine}</strong>` : ""
        }.</p>
        <p style="margin:0 0 8px;color:#6b7280;font-size:14px;">Order reference</p>
        <p style="margin:0 0 20px;font-family:ui-monospace,monospace;font-size:13px;word-break:break-all;">${input.sessionId}</p>
        <p style="margin:0 0 20px;">If you have questions, reply to this email or use the contact form on our website.</p>
        <p style="margin:0;color:#6b7280;font-size:14px;">— ShadowSend (Xtinadom LLC)</p>
      </td>
    </tr>
  </table>
</body>
</html>`.trim();

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to: input.to,
    subject: "Thanks for your ShadowSend order",
    html,
  });

  if (error) {
    console.error("[order-email]", error);
    return { ok: false, reason: error.message };
  }
  return { ok: true };
}
