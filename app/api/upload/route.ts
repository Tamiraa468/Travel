import { NextRequest, NextResponse } from "next/server";
import { sanitizeFilename } from "@/lib/security";

export const runtime = "nodejs";

// Maximum file size: 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { ok: false, error: "No file provided" },
        { status: 400 }
      );
    }

    // Security: Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { ok: false, error: "File too large. Maximum size is 5MB" },
        { status: 400 }
      );
    }

    // Security: Validate file type (check both MIME type and extension)
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { ok: false, error: "Invalid file type. Use JPEG, PNG, WebP, or GIF" },
        { status: 400 }
      );
    }

    // Security: Validate extension matches MIME type
    const filename = sanitizeFilename(file.name);
    const extension = filename.split(".").pop()?.toLowerCase();
    const validExtensions: Record<string, string[]> = {
      "image/jpeg": ["jpg", "jpeg"],
      "image/png": ["png"],
      "image/webp": ["webp"],
      "image/gif": ["gif"],
    };

    if (!extension || !validExtensions[file.type]?.includes(extension)) {
      return NextResponse.json(
        { ok: false, error: "File extension does not match content type" },
        { status: 400 }
      );
    }

    // Security: Check magic bytes (file signature) to prevent disguised files
    const bytes = await file.arrayBuffer();
    const header = new Uint8Array(bytes.slice(0, 12));

    const isValidMagic =
      // JPEG: FF D8 FF
      (header[0] === 0xff && header[1] === 0xd8 && header[2] === 0xff) ||
      // PNG: 89 50 4E 47 0D 0A 1A 0A
      (header[0] === 0x89 &&
        header[1] === 0x50 &&
        header[2] === 0x4e &&
        header[3] === 0x47) ||
      // GIF: 47 49 46 38
      (header[0] === 0x47 &&
        header[1] === 0x49 &&
        header[2] === 0x46 &&
        header[3] === 0x38) ||
      // WebP: 52 49 46 46 ... 57 45 42 50
      (header[0] === 0x52 &&
        header[1] === 0x49 &&
        header[2] === 0x46 &&
        header[3] === 0x46 &&
        header[8] === 0x57 &&
        header[9] === 0x45 &&
        header[10] === 0x42 &&
        header[11] === 0x50);

    if (!isValidMagic) {
      return NextResponse.json(
        { ok: false, error: "Invalid file content" },
        { status: 400 }
      );
    }

    // Convert to base64
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString("base64");
    const dataUrl = `data:${file.type};base64,${base64}`;

    return NextResponse.json(
      { ok: true, url: dataUrl, filename },
      { status: 200 }
    );
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { ok: false, error: "Upload failed" },
      { status: 500 }
    );
  }
}
