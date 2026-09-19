/**
 * Lightweight image dimension readers from file headers (no native deps).
 */

function readUInt32BE(bytes: Uint8Array, offset: number): number {
  return (
    ((bytes[offset]! << 24) |
      (bytes[offset + 1]! << 16) |
      (bytes[offset + 2]! << 8) |
      bytes[offset + 3]!) >>>
    0
  );
}

function readUInt16BE(bytes: Uint8Array, offset: number): number {
  return ((bytes[offset]! << 8) | bytes[offset + 1]!) >>> 0;
}

function readUInt16LE(bytes: Uint8Array, offset: number): number {
  return (bytes[offset]! | (bytes[offset + 1]! << 8)) >>> 0;
}

function readPngSize(
  bytes: Uint8Array,
): { width: number; height: number } | null {
  if (bytes.length < 24) return null;
  const width = readUInt32BE(bytes, 16);
  const height = readUInt32BE(bytes, 20);
  if (width < 1 || height < 1) return null;
  return { width, height };
}

function readJpegSize(
  bytes: Uint8Array,
): { width: number; height: number } | null {
  let offset = 2;
  while (offset + 9 < bytes.length) {
    if (bytes[offset] !== 0xff) return null;
    const marker = bytes[offset + 1]!;
    offset += 2;
    // SOF0–SOF3, SOF5–SOF7, SOF9–SOF11, SOF13–SOF15
    if (
      (marker >= 0xc0 && marker <= 0xc3) ||
      (marker >= 0xc5 && marker <= 0xc7) ||
      (marker >= 0xc9 && marker <= 0xcb) ||
      (marker >= 0xcd && marker <= 0xcf)
    ) {
      const height = readUInt16BE(bytes, offset + 3);
      const width = readUInt16BE(bytes, offset + 5);
      if (width < 1 || height < 1) return null;
      return { width, height };
    }
    if (marker === 0xd9 || marker === 0xda) return null;
    const length = readUInt16BE(bytes, offset);
    if (length < 2) return null;
    offset += length;
  }
  return null;
}

function readWebpSize(
  bytes: Uint8Array,
): { width: number; height: number } | null {
  if (bytes.length < 30) return null;
  const chunk = String.fromCharCode(
    bytes[12]!,
    bytes[13]!,
    bytes[14]!,
    bytes[15]!,
  );
  if (chunk === "VP8X" && bytes.length >= 30) {
    const width = 1 + (bytes[24]! | (bytes[25]! << 8) | (bytes[26]! << 16));
    const height = 1 + (bytes[27]! | (bytes[28]! << 8) | (bytes[29]! << 16));
    if (width < 1 || height < 1) return null;
    return { width, height };
  }
  if (chunk === "VP8 " && bytes.length >= 30) {
    const width = readUInt16LE(bytes, 26) & 0x3fff;
    const height = readUInt16LE(bytes, 28) & 0x3fff;
    if (width < 1 || height < 1) return null;
    return { width, height };
  }
  if (chunk === "VP8L" && bytes.length >= 25) {
    const b0 = bytes[21]!;
    const b1 = bytes[22]!;
    const b2 = bytes[23]!;
    const b3 = bytes[24]!;
    const width = 1 + (((b1 & 0x3f) << 8) | b0);
    const height = 1 + (((b3 & 0xf) << 10) | (b2 << 2) | ((b1 & 0xc0) >> 6));
    if (width < 1 || height < 1) return null;
    return { width, height };
  }
  return null;
}

export function readImageDimensions(
  bytes: Uint8Array,
  mimeType: string,
): { width: number; height: number } | null {
  if (mimeType === "image/png") return readPngSize(bytes);
  if (mimeType === "image/jpeg") return readJpegSize(bytes);
  if (mimeType === "image/webp") return readWebpSize(bytes);
  return null;
}
