import { emailQueue } from "./config";
import Campaign from "@/models/Campaign";
import connectDB from "@/lib/db/connect";

export interface EmailJobData {
  campaignId: string;
  organizationId: string;
  recipient: {
    Email: string;
    Name: string;
    [key: string]: any; // other variables
  };
  htmlContent: string; // The base template
  subject: string;
}

export async function addEmailsToQueue(
  campaignId: string,
  organizationId: string,
  subject: string,
  htmlContent: string,
  recipients: any[]
) {
  // We use addBulk for performance
  const jobs = recipients.map((recipient) => ({
    name: "send-email",
    data: {
      campaignId,
      organizationId,
      recipient,
      htmlContent,
      subject,
    } as EmailJobData,
  }));

  // Push all jobs to Redis
  await emailQueue.addBulk(jobs);

  // Update Campaign Status
  await connectDB();
  await Campaign.findByIdAndUpdate(campaignId, {
    status: "Queued",
    "stats.total": recipients.length,
  });

  return { success: true, count: recipients.length };
}
