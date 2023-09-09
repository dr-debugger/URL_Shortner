import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MOGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database Connected");
  } catch (err) {
    console.error(err.message, "db");
    process.exit(1);
  }
};

export default connectDB;
