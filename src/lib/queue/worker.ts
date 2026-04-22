import { Worker, Job } from "bullmq";
import { EMAIL_QUEUE_NAME, connection } from "./config";
import { EmailJobData } from "./producer";
import { createTransporter, compileTemplate } from "@/lib/email/mailer";
import Campaign from "@/models/Campaign";
import connectDB from "@/lib/db/connect";

export const emailWorker = new Worker<EmailJobData>(
  EMAIL_QUEUE_NAME,
  async (job: Job<EmailJobData>) => {
    const { campaignId, organizationId, recipient, htmlContent, subject } = job.data;

    try {
      // 1. Get Transporter per Organization
      const transporter = await createTransporter(organizationId);

      // 2. Compile HTML with recipient variables
      const compiledHtml = compileTemplate(htmlContent, recipient);
      const compiledSubject = compileTemplate(subject, recipient);

      // 3. Setup mail options
      const mailOptions = {
        from: (transporter.options as any).auth?.user || "noreply@inomail.com",
        to: recipient.Email,
        subject: compiledSubject,
        html: compiledHtml,
      };

      // 4. Send Email
      const info = await transporter.sendMail(mailOptions);

      // 5. Update Success Analytics
      await connectDB();
      await Campaign.findByIdAndUpdate(campaignId, {
        $inc: { "stats.sent": 1 },
      });

      return { success: true, messageId: info.messageId };
    } catch (error: any) {
      console.error(`Failed to send email to ${recipient.Email}:`, error);

      // Update Failure Analytics
      await connectDB();
      await Campaign.findByIdAndUpdate(campaignId, {
        $inc: { "stats.failed": 1 },
      });

      throw error; // Let BullMQ handle retries
    }
  },
  {
    connection,
    concurrency: 5, // Process 5 emails concurrently per worker
    limiter: {
      max: 10, // Max 10 emails
      duration: 1000, // per 1 second (Rate limiting)
    },
  }
);

emailWorker.on("completed", (job) => {
  console.log(`Job ${job.id} completed successfully`);
});

emailWorker.on("failed", (job, err) => {
  console.log(`Job ${job?.id} failed with error ${err.message}`);
});
