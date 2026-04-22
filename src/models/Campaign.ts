import mongoose, { Schema, Document } from "mongoose";

export interface ICampaign extends Document {
  organizationId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId; // Who created it
  name: string;
  subject: string;
  templateId?: mongoose.Types.ObjectId;
  htmlContent: string;
  status: "Draft" | "Queued" | "Processing" | "Completed" | "Failed";
  stats: {
    total: number;
    sent: number;
    failed: number;
    opened: number;
    clicked: number;
    bounced: number;
  };
  assets: {
    groupName: string;
    files: { url: string; name: string }[];
  }[];
  scheduledAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const CampaignSchema = new Schema<ICampaign>(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: "Organization", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    subject: { type: String, required: true },
    templateId: { type: Schema.Types.ObjectId, ref: "Template" },
    htmlContent: { type: String, required: true },
    status: { 
      type: String, 
      enum: ["Draft", "Queued", "Processing", "Completed", "Failed"], 
      default: "Draft" 
    },
    stats: {
      total: { type: Number, default: 0 },
      sent: { type: Number, default: 0 },
      failed: { type: Number, default: 0 },
      opened: { type: Number, default: 0 },
      clicked: { type: Number, default: 0 },
      bounced: { type: Number, default: 0 },
    },
    assets: [
      {
        groupName: { type: String },
        files: [
          {
            url: { type: String },
            name: { type: String },
          }
        ]
      }
    ],
    scheduledAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.models.Campaign || mongoose.model<ICampaign>("Campaign", CampaignSchema);
