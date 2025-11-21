import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../../../utils/connectDb";
import PhotoModel from "@/app/Model/Photo";
import { Types } from "mongoose";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  await connectDB();

  const record = await PhotoModel.findById(new Types.ObjectId(id));
  if (!record) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  // Return all photos in the record
  return NextResponse.json({
    sessionId: record.sessionId,
    photos: record.photos.map((p: any) => ({
      imageName: p.imageName,
      imageType: p.imageType,
      imageBase64: p.imageBase64, // already a data URI
    })),
  });
}
