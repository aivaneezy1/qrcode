import { NextRequest, NextResponse } from "next/server";
import { Buffer } from "buffer";
import { connectDB } from "../../../utils/connectDb";
import PhotoModel from "@/app/Model/Photo";
import { Types } from "mongoose";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  await connectDB();

  const image = await PhotoModel.findById(new Types.ObjectId(id));
  if (!image) return new NextResponse("Not found", { status: 404 });

  const base64Data = image.imageBase64.replace(/^data:image\/\w+;base64,/, "");
  const buffer = Buffer.from(base64Data, "base64");

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": image.imageType,
      "Content-Disposition": `inline; filename="${image.imageName}"`,
    },
  });
}
