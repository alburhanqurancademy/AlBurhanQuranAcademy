import mongoose, { Schema, models, model } from "mongoose";

const TrialSchema = new Schema(
  {
    name:      { type: String, required: true },
    email:     { type: String, required: true },
    phone:     { type: String, required: true },
    course:    { type: String },
    preferred: { type: String },
    status:    { type: String, enum: ["pending", "confirmed", "cancelled", "completed"], default: "pending" },
  },
  { timestamps: true }
);

export const Trial = models.Trial || model("Trial", TrialSchema);
