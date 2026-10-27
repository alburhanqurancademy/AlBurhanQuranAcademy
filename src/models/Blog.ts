import mongoose, { Schema, models, model } from "mongoose";
import { StoredImageSchema } from "@/models/StoredImage";

// One Ayah/Hadees block: arabic + ref + translation, plus an optional free-text
// note for context (tashreeh, explanation, etc.).
const HadeesSchema = new Schema(
  {
    arabic:      { type: String, default: "" },
    arabicRef:   { type: String, default: "" },
    translation: { type: String, default: "" },
    note:        { type: String, default: "" },
  },
  { _id: false }
);

// One article section ("bullet"): a heading + description, with optional
// bullet-point list and any number of Ayah/Hadees blocks. The flat
// arabic/arabicRef/translation fields are the legacy single-block shape, kept so
// older posts still render; the editor now saves into `hadees` instead.
const BlogSectionSchema = new Schema(
  {
    heading:     { type: String, default: "" },
    body:        { type: String, required: true },
    list:        { type: [String], default: undefined },
    hadees:      { type: [HadeesSchema], default: undefined },
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
    // Uploaded image as binary; `image` is the legacy base64 data URI, cleared
    // when a post is next saved with a new image (or by `npm run migrate:images`).
    imageFile: { type: StoredImageSchema, select: false },
    image:    { type: String },
    category: { type: String, required: true },
    intro:    { type: String, default: "" },
    writer:   { type: String, default: "" },
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
