import { Schema } from "mongoose";

// An uploaded image kept as raw bytes (MongoDB BinData) plus its MIME type.
// Models mount it as `imageFile` with `select: false`, so ordinary queries never
// pull the bytes — only the /image routes ask for them explicitly.
export const StoredImageSchema = new Schema(
  {
    data:        { type: Buffer, required: true },
    contentType: { type: String, required: true },
  },
  { _id: false }
);
