import { createTransport } from "nodemailer";

export type MailConfig = {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  from: string;
};

export function getMailConfig(): MailConfig | undefined {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT ?? 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM ?? process.env.ADMIN_EMAIL;

  if (!host || !user || !pass || !from) return undefined;

  return {
    host,
    port,
    secure: port === 465,
    user,
    pass,
    from,
  };
}

export function buildContactEmailHtml(data: {
  name: string;
  email: string;
  phone?: string;
  course?: string;
  message: string;
}) {
  const { name, email, phone, course, message } = data;

  return `
    <div style="font-family: Arial, sans-serif; color: #111827; line-height: 1.6;">
      <h2 style="margin-bottom: 12px;">New contact request</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone || "N/A"}</p>
      <p><strong>Course:</strong> ${course || "N/A"}</p>
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, "<br />")}</p>
    </div>
  `;
}

export async function sendMail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  const config = getMailConfig();

  if (!config) {
    return {
      ok: false,
      status: "not-configured",
      message: "Mail transport is not configured.",
    };
  }

  const transporter = createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.user,
      pass: config.pass,
    },
  });

  await transporter.sendMail({
    from: config.from,
    to,
    subject,
    html,
  });

  return { ok: true, status: "sent" };
}
