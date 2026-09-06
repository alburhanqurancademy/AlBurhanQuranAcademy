import mongoose, { Schema, models, model } from "mongoose";

const CourseSchema = new Schema(
  {
    title:         { type: String, required: true },
    slug:          { type: String, required: true, unique: true },
    description:   { type: String, required: true },
    image:         { type: String },
    ageGroup:      { type: String, default: "" },
    duration:      { type: String, default: "" },
    classDuration: { type: String, default: "" },
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
