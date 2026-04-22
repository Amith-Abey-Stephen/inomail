import mongoose, { Schema, Document } from "mongoose";

export interface ITemplate extends Document {
  organizationId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  name: string;
  htmlContent: string;
  designJson?: string; // If we use an email builder like react-email or similar
  variables: string[]; // e.g., ["name", "company", "asset1"]
  createdAt: Date;
  updatedAt: Date;
}

const TemplateSchema = new Schema<ITemplate>(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: "Organization", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    htmlContent: { type: String, required: true },
    designJson: { type: String },
    variables: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.models.Template || mongoose.model<ITemplate>("Template", TemplateSchema);
