import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";
import { connectDB } from "../../utils/connectDb";
import PhotoModel from "@/app/Model/Photo";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // Ensure entries are File[]
    const rawFiles = formData.getAll("images");
    const files = rawFiles.filter((f): f is File => f instanceof File);

    const sessionId = formData.get("sessionId");

    if (!sessionId) {
      return NextResponse.json(
        { message: "Missing sessionId" },
        { status: 400 }
      );
    }

    if (files.length === 0) {
      return NextResponse.json(
        { message: "No files uploaded" },
        { status: 400 }
      );
    }

    await connectDB();

    const processedImages: any[] = [];

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const uniqueId = uuidv4();
      const webpFilename = `${uniqueId}.webp`;

      // Convert + compress
      const compressedBuffer = await sharp(buffer)
        .resize({ width: 1280, withoutEnlargement: true })
        .webp({ quality: 70 })
        .toBuffer();

      const base64 = compressedBuffer.toString("base64");

      processedImages.push({
        imageName: webpFilename,
        imageType: "image/webp",
        imageBase64: `data:image/webp;base64,${base64}`,
      });
    }

    // Save in DB
    const record = await PhotoModel.create({
      sessionId,
      photos: processedImages,
    });

    return NextResponse.json({
      message: "Upload successful",
      id: record._id,
    });
  } catch (err: any) {
    console.error("Upload error:", err);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
