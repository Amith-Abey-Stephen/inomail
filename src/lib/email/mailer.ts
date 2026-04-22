import nodemailer from "nodemailer";
import Organization from "@/models/Organization";
import connectDB from "@/lib/db/connect";

export async function createTransporter(organizationId: string) {
  await connectDB();
  const org = await Organization.findById(organizationId);

  if (!org || !org.emailConfig || !org.emailConfig.email) {
    throw new Error("Organization email configuration is missing.");
  }

  const { email, appPassword, smtpHost, smtpPort, smtpUser, smtpPass } = org.emailConfig;

  // Use custom SMTP if provided, otherwise default to generic SMTP (like Gmail App Passwords)
  if (smtpHost && smtpPort && smtpUser && smtpPass) {
    return nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });
  }

  // Fallback to Gmail service using App Password
  if (appPassword) {
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: email,
        pass: appPassword,
      },
    });
  }

  throw new Error("Invalid email configuration. Please provide an App Password or full SMTP details.");
}

export function compileTemplate(html: string, variables: Record<string, any>) {
  let compiled = html;
  for (const [key, value] of Object.entries(variables)) {
    const regex = new RegExp(`{{${key}}}`, "g");
    compiled = compiled.replace(regex, String(value));
  }
  return compiled;
}
