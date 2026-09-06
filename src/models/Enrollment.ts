import mongoose, { Schema, models, model } from "mongoose";

const EnrollmentSchema = new Schema(
  {
    name:               { type: String, required: true },
    email:              { type: String, required: true },
    phone:              { type: String, required: true },
    course:             { type: String, required: true },
    country:            { type: String, default: "" },
    gender:             { type: String, default: "" },
    age:                { type: String, default: "" },
    guardianName:       { type: String, default: "" },
    guardianPhone:      { type: String, default: "" },
    convenientTimeFrom: { type: String, default: "" },
    convenientTimeTo:   { type: String, default: "" },
    frequency:          { type: String, default: "" },
    daySlot:            { type: String, default: "" },
    status:             { type: String, enum: ["pending", "approved", "rejected", "completed"], default: "pending" },
    message:            { type: String, default: "" },
  },
  { timestamps: true }
);

// `mongoose` is registered in `serverExternalPackages` (next.config.ts), so it's loaded
// through Node's persistent module cache instead of webpack. That means `mongoose.models`
// survives Next.js dev-server hot reloads across file edits. With the old
// `models.Enrollment || model(...)` guard, once a model was compiled once, later schema
// edits (like adding the new enrollment fields) kept being ignored — the stale, previously
// compiled model was always returned, so the extra fields were silently stripped on save
// and never reached MongoDB or the admin dashboard.
// Deleting any previously compiled model before recompiling guarantees the schema
// currently on disk is always the one mongoose uses, in dev and prod alike.
if (models.Enrollment) {
  delete models.Enrollment;
}

export const Enrollment = model("Enrollment", EnrollmentSchema);
