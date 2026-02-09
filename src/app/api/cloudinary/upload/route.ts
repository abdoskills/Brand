import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (cloudName && apiKey && apiSecret) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });
}

export async function POST(req: Request) {
  if (!cloudName || !apiKey || !apiSecret) {
    return NextResponse.json(
      { error: "Missing Cloudinary environment variables." },
      { status: 500 },
    );
  }

  const formData = await req.formData();
  const files = formData.getAll("file");

  if (!files.length) {
    return NextResponse.json({ error: "No files provided." }, { status: 400 });
  }

  try {
    const uploads = await Promise.all(
      files.map(async (file) => {
        if (!(file instanceof File)) {
          throw new Error("Invalid file payload.");
        }
        const buffer = Buffer.from(await file.arrayBuffer());
        const base64 = buffer.toString("base64");
        const dataUri = `data:${file.type};base64,${base64}`;
        const result = await cloudinary.uploader.upload(dataUri, {
          folder: "products",
        });
        return {
          url: result.secure_url,
          publicId: result.public_id,
          originalFilename: result.original_filename,
          width: result.width,
          height: result.height,
        };
      }),
    );

    return NextResponse.json({ files: uploads });
  } catch (error) {
    console.error("[cloudinary] upload error", error);
    const message = error instanceof Error ? error.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
