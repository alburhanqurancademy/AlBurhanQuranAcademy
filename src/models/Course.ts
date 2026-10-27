import mongoose, { Schema, models, model } from "mongoose";
import { StoredImageSchema } from "@/models/StoredImage";

const CourseSchema = new Schema(
  {
    title:         { type: String, required: true },
    slug:          { type: String, required: true, unique: true },
    description:   { type: String, required: true },
    // Uploaded image as binary; `image` is the legacy base64 data URI, cleared
    // when a course is next saved with a new image (or by `npm run migrate:images`).
    imageFile:     { type: StoredImageSchema, select: false },
    image:         { type: String },
    ageGroup:      { type: String, default: "" },
    duration:      { type: String, default: "" },
    classDuration: { type: String, default: "" },
    detailHeading: { type: String, default: "" },
    detailText:    { type: String, default: "" },
    bullets:       { type: [String], default: [] },
    level:         { type: String, enum: ["beginner", "intermediate", "advanced"], default: "beginner" },
    status:        { type: String, enum: ["active", "inactive"], default: "active" },
  },
  { timestamps: true }
);

// Same hot-reload guard as Enrollment.ts: mongoose survives dev-server reloads
// through Node's module cache, so a previously compiled Course model would
// silently strip the newer ageGroup/classDuration/bullets fields.
if (models.Course) {
  delete models.Course;
}

export const Course = model("Course", CourseSchema);
