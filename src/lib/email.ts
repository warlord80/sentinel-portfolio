import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Free tier: use onboarding@resend.dev (works immediately, no domain setup).
// To use your own domain: verify it at resend.com/domains, then update FROM.
const FROM = "onboarding@resend.dev";
const TO = "chibuikenwozor@gmail.com";

export async function sendContactEmail({
  name,
  email,
  message,
}: {
  name: string;
  email: string;
  message: string;
}) {
  const html = `
    <div style="font-family:system-ui,-apple-system,sans-serif;max-width:600px;margin:0 auto;padding:32px;background:#0A0A0D;color:#F3F1EB;border-radius:8px;border:1px solid rgba(255,255,255,0.1)">
      <h2 style="color:#C99A4A;font-size:20px;margin:0 0 24px">New Contact Form Submission</h2>
      <table style="width:100%;border-collapse:collapse">
        <tr>
          <td style="padding:12px 0;color:#AAA7A0;font-size:13px;text-transform:uppercase;letter-spacing:0.08em;width:100px">Name</td>
          <td style="padding:12px 0;color:#F3F1EB;font-size:15px">${escapeHtml(name)}</td>
        </tr>
        <tr>
          <td style="padding:12px 0;color:#AAA7A0;font-size:13px;text-transform:uppercase;letter-spacing:0.08em">Email</td>
          <td style="padding:12px 0;color:#F3F1EB;font-size:15px"><a href="mailto:${escapeHtml(email)}" style="color:#C99A4A;text-decoration:none">${escapeHtml(email)}</a></td>
        </tr>
        <tr>
          <td style="padding:12px 0;color:#AAA7A0;font-size:13px;text-transform:uppercase;letter-spacing:0.08em;vertical-align:top">Message</td>
          <td style="padding:12px 0;color:#F3F1EB;font-size:15px;line-height:1.6">${escapeHtml(message).replace(/\n/g, "<br>")}</td>
        </tr>
      </table>
      <div style="margin-top:24px;padding-top:16px;border-top:1px solid rgba(255,255,255,0.1);color:#AAA7A0;font-size:12px">
        Sent via your portfolio contact form
      </div>
    </div>
  `;

  await resend.emails.send({
    from: FROM,
    to: TO,
    replyTo: email,
    subject: `Portfolio: ${name} sent you a message`,
    html,
  });
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
