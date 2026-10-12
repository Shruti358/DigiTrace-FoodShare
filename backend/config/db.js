import mongoose from "mongoose";

const connectDB = async () => {
  const { MONGO_URI } = process.env;

  if (!MONGO_URI) {
    console.warn("MONGO_URI is not set; starting without a database connection.");
    return;
  }

  await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 });
  console.log("MongoDB connected successfully.");
};

export default connectDB;