import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";
import { connectDB } from "../../utils/connectDb";
import PhotoModel from "@/app/Model/Photo";

export async function POST(request: NextRequest) {
  try {
    // variable
    const formData = await request.formData();
    const file = formData.get("image") as File | null;

    if (!file) {
      return NextResponse.json(
        { message: "No file uploaded" },
        { status: 400 }
      );
    }

    await connectDB();

    const buffer = Buffer.from(await file.arrayBuffer());
    const uniqueId = uuidv4();
    const webpFilename = `${uniqueId}.webp`;

    // Compress and convert to WebP
    const compressedBuffer = await sharp(buffer)
      .resize({ width: 1280, withoutEnlargement: true })
      .webp({ quality: 70 })
      .toBuffer();

    const base64 = compressedBuffer.toString("base64");
    const dataUri = `data:image/webp;base64,${base64}`;

    // Save image in MongoDB
    const newPhoto = await PhotoModel.create({
      imageName: webpFilename,
      imageType: "image/webp",
      imageBase64: dataUri,
    });

    // Public image URL
    const imageUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/image/${newPhoto._id}`;

    return NextResponse.json(
      { message: "Upload successful", imageUrl },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Upload error:", err);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
