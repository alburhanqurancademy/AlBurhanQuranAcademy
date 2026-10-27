import mongoose, { Schema, models, model } from "mongoose";
import bcrypt from "bcryptjs";
import { StoredImageSchema } from "@/models/StoredImage";

const UserSchema = new Schema(
  {
    name:     { type: String, required: true },
    email:    { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role:     { type: String, enum: ["user", "admin", "superadmin"], default: "user" },
    // Profile picture as binary; `image` is the legacy base64 data URI.
    imageFile: { type: StoredImageSchema, select: false },
    image:    { type: String, default: "" },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// Same hot-reload guard as Blog.ts: a previously compiled User model (without
// `imageFile`) would silently strip the new field.
if (models.User) {
  delete models.User;
}

export const User = models.User || model("User", UserSchema);
