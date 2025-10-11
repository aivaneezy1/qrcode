import mongoose from "mongoose";

const PhotoSchema = new mongoose.Schema({
  imageName: String,
  imageType: String,
  imageBase64: String,
});

const PhotoModel =
  mongoose.models.Photo || mongoose.model("Photo", PhotoSchema);

export default PhotoModel;
