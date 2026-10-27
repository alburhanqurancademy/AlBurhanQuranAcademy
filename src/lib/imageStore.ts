import { NextRequest, NextResponse } from "next/server";

// Images live in MongoDB as binary (`imageFile: { data, contentType }`) and are
// served by /api/<resource>/[id]/image. Older documents may still carry the
// previous base64 data URI in `image`; everything here handles both shapes until
// `npm run migrate:images` has converted them.

export interface StoredImage {
  data: Buffer;
  contentType: string;
}

interface ImageDoc {
  imageFile?: { data?: Uint8Array | null; contentType?: string | null } | null;
  image?: string | null;
}

const IMMUTABLE = "public, max-age=31536000, immutable";

// Aggregation stages for list queries: flag whether a document has an uploaded
// image, then drop the bytes (and any legacy data URI) so they aren't even
// transferred from MongoDB.
const HAS_LEGACY_DATA_URI = { $regexMatch: { input: "$image", regex: /^data:/ } };

export const IMAGE_LIST_STAGES = [
  {
    $addFields: {
      hasStoredImage: {
        $or: [{ $ne: [{ $type: "$imageFile.contentType" }, "missing"] }, HAS_LEGACY_DATA_URI],
      },
      image: { $cond: [HAS_LEGACY_DATA_URI, "", "$image"] },
    },
  },
  { $project: { imageFile: 0 } },
];

export function imageUrl(basePath: string, id: unknown, updatedAt: unknown) {
  return `${basePath}/${id}/image?v=${new Date(updatedAt as string).getTime()}`;
}

// For a document produced by IMAGE_LIST_STAGES: swaps the flag for a URL the
// browser can cache. The `?v=` stamp changes when the document is updated, so a
// replaced image gets a fresh URL and the long cache stays safe.
export function withImageUrl<T extends { _id?: unknown; updatedAt?: unknown; image?: string; hasStoredImage?: boolean }>(
  doc: T,
  basePath: string
) {
  const { hasStoredImage, ...rest } = doc;
  return {
    ...rest,
    image: hasStoredImage ? imageUrl(basePath, doc._id, doc.updatedAt) : doc.image ?? "",
  };
}

// For a single document (hydrated or lean) whose image is always present:
// strips any image bytes and points `image` at the image route.
export function singleWithImageUrl(doc: any, basePath: string) {
  const obj = typeof doc.toObject === "function" ? doc.toObject() : { ...doc };
  delete obj.imageFile;
  return { ...obj, image: imageUrl(basePath, obj._id, obj.updatedAt) };
}

// Responds with the stored image as a real image file. Falls back to a legacy
// base64 data URI, or redirects when `image` is a plain path/URL.
export function imageResponse(req: NextRequest, doc: ImageDoc | null, cacheControl = IMMUTABLE) {
  const file = doc?.imageFile;
  if (file?.data) {
    return new NextResponse(Buffer.from(file.data), {
      headers: {
        "Content-Type": file.contentType || "application/octet-stream",
        "Cache-Control": cacheControl,
      },
    });
  }

  const image = doc?.image;
  if (!image) return new NextResponse(null, { status: 404 });

  const match = /^data:([^;]+);base64,([\s\S]*)$/.exec(image);
  if (!match) {
    // A plain path or URL (e.g. "/Quran Gateway.png") — just send the browser there.
    return NextResponse.redirect(new URL(image, req.url));
  }

  return new NextResponse(Buffer.from(match[2], "base64"), {
    headers: { "Content-Type": match[1], "Cache-Control": cacheControl },
  });
}
