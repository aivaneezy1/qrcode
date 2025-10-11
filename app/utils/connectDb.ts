import mongoose from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL as string;
const connectDB = async () => {
  try {
    if (mongoose.connection.readyState >= 1) {
      console.log("Already connected to the database");
      return;
    }
    // connect database
    await mongoose.connect(MONGODB_URL);
    console.log("Data is connected successfully");
  } catch (err) {
    console.error("Database connection error", err);
    throw err;
  }
};

export { connectDB };
