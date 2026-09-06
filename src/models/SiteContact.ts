import mongoose, { Schema, models, model } from "mongoose";

// Singleton document holding the contact details displayed on the website.
// Managed from the admin dashboard (Contacts tab) — updated only, never listed.
const SiteContactSchema = new Schema(
  {
    phone:    { type: String, required: true },
    whatsapp: { type: String, required: true },
    email:    { type: String, required: true },
  },
  { timestamps: true }
);

export const SiteContact = models.SiteContact || model("SiteContact", SiteContactSchema);
