import mongoose, { Schema, models, model } from "mongoose";

// One article section ("bullet"): a heading + description, with optional
// bullet-point list and an optional Ayah/Hadees block (arabic + ref + translation).
const BlogSectionSchema = new Schema(
  {
    heading:     { type: String, default: "" },
    body:        { type: String, required: true },
    list:        { type: [String], default: undefined },
    arabic:      { type: String, default: "" },
    arabicRef:   { type: String, default: "" },
    translation: { type: String, default: "" },
  },
  { _id: false }
);

const BlogSchema = new Schema(
  {
    title:    { type: String, required: true },
    slug:     { type: String, required: true, unique: true },
    excerpt:  { type: String, required: true },
    image:    { type: String },
    category: { type: String, required: true },
    intro:    { type: String, default: "" },
    sections: { type: [BlogSectionSchema], default: [] },
    readTime: { type: String, default: "1 min read" },
    status:   { type: String, enum: ["draft", "published"], default: "published" },
  },
  { timestamps: true }
);

// Same hot-reload guard as Enrollment.ts: mongoose survives dev-server reloads
// through Node's module cache, so a previously compiled Blog model (with the old
// `content` schema) would silently strip the new `intro`/`sections` fields.
if (models.Blog) {
  delete models.Blog;
}

export const Blog = model("Blog", BlogSchema);
