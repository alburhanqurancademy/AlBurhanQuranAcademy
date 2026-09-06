import mongoose, { Schema, models, model } from "mongoose";

const ContactSchema = new Schema(
  {
    name:    { type: String, required: true },
    email:   { type: String, required: true },
    subject: { type: String },
    message: { type: String, required: true },
    read:    { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Contact = models.Contact || model("Contact", ContactSchema);
