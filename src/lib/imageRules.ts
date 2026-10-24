// Upload rule for course and blog images: exact pixel size only. Shared by the
// admin forms (instant feedback) and the API (the real enforcement — a client
// check can be bypassed). 1200 x 630 is close to the shape the cards display
// (about 1.9:1), so object-cover crops very little.
export const IMAGE_WIDTH = 1200;
export const IMAGE_HEIGHT = 630;

export const IMAGE_RULE_TEXT = `${IMAGE_WIDTH} × ${IMAGE_HEIGHT} px`;

export function dimensionMessage(width: number, height: number) {
  return `Image must be exactly ${IMAGE_WIDTH} × ${IMAGE_HEIGHT} px (yours is ${width} × ${height} px).`;
}

// Reads the pixel size straight from the file header, so the server needs no
// image library. Returns null when the format isn't recognised.
export function getImageDimensions(bytes: Uint8Array): { width: number; height: number } | null {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const ascii = (at: number, len: number) => String.fromCharCode(...bytes.subarray(at, at + len));

  // PNG
  if (bytes.length >= 24 && view.getUint32(0) === 0x89504e47) {
    return { width: view.getUint32(16), height: view.getUint32(20) };
  }

  // GIF
  if (bytes.length >= 10 && ascii(0, 3) === "GIF") {
    return { width: view.getUint16(6, true), height: view.getUint16(8, true) };
  }

  // JPEG — walk the segments until a start-of-frame marker
  if (bytes.length >= 4 && bytes[0] === 0xff && bytes[1] === 0xd8) {
    let i = 2;
    while (i + 9 < bytes.length) {
      if (bytes[i] !== 0xff) { i++; continue; }
      const marker = bytes[i + 1];
      if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
        return { height: view.getUint16(i + 5), width: view.getUint16(i + 7) };
      }
      i += 2 + view.getUint16(i + 2);
    }
    return null;
  }

  // WebP (lossy VP8, lossless VP8L, extended VP8X)
  if (bytes.length >= 30 && ascii(0, 4) === "RIFF" && ascii(8, 4) === "WEBP") {
    const chunk = ascii(12, 4);
    if (chunk === "VP8 ") {
      return { width: view.getUint16(26, true) & 0x3fff, height: view.getUint16(28, true) & 0x3fff };
    }
    if (chunk === "VP8L") {
      const b = view.getUint32(21, true);
      return { width: (b & 0x3fff) + 1, height: ((b >> 14) & 0x3fff) + 1 };
    }
    if (chunk === "VP8X") {
      return {
        width: (bytes[24] | (bytes[25] << 8) | (bytes[26] << 16)) + 1,
        height: (bytes[27] | (bytes[28] << 8) | (bytes[29] << 16)) + 1,
      };
    }
  }

  return null;
}

// Server-side check. Returns an error message, or null when the image is fine.
export function validateImageBytes(bytes: Uint8Array): string | null {
  const dims = getImageDimensions(bytes);
  if (!dims) return "Could not read the image. Please upload a valid JPG, PNG, WEBP or GIF.";
  if (dims.width !== IMAGE_WIDTH || dims.height !== IMAGE_HEIGHT) return dimensionMessage(dims.width, dims.height);
  return null;
}

// Browser-side check used by the admin forms. Returns an error message, or null.
export function validateImageFile(file: File): Promise<string | null> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(
        img.naturalWidth === IMAGE_WIDTH && img.naturalHeight === IMAGE_HEIGHT
          ? null
          : dimensionMessage(img.naturalWidth, img.naturalHeight)
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve("Could not read the image. Please upload a valid JPG, PNG, WEBP or GIF.");
    };
    img.src = url;
  });
}
