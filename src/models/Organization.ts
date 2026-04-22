import mongoose, { Schema, Document } from "mongoose";

export interface IOrganization extends Document {
  name: string;
  slug: string;
  plan: "Starter" | "Pro" | "Enterprise";
  emailConfig: {
    email: string;
    appPassword?: string;
    smtpHost?: string;
    smtpPort?: number;
    smtpUser?: string;
    smtpPass?: string;
  };
  rateLimit: {
    maxEmailsPerDay: number;
    maxMembers: number;
  };
  members: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const OrganizationSchema = new Schema<IOrganization>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    plan: { type: String, enum: ["Starter", "Pro", "Enterprise"], default: "Starter" },
    emailConfig: {
      email: { type: String },
      appPassword: { type: String },
      smtpHost: { type: String },
      smtpPort: { type: Number },
      smtpUser: { type: String },
      smtpPass: { type: String },
    },
    rateLimit: {
      maxEmailsPerDay: { type: Number, default: 100 },
      maxMembers: { type: Number, default: 1 },
    },
    members: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

export default mongoose.models.Organization || mongoose.model<IOrganization>("Organization", OrganizationSchema);
