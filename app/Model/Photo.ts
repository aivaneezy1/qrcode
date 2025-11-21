import mongoose from "mongoose";

const PhotoMetaData = new mongoose.Schema({
  imageName: String,
  imageType: String,
  imageBase64: String,
});

const PhotoSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true, // Track the user session
  },
  photos: [PhotoMetaData], // Multiple photos
  uploadedAt: {
    // uploaded date
    type: Date,
    default: Date.now,
  },
});

const PhotoModel =
  mongoose.models.Photo || mongoose.model("Photo", PhotoSchema);

export default PhotoModel;
