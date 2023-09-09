import express from "express";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";

dotenv.config();
const app = express();

import urlRouter from "./src/routes/urlRoute.js";

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api", urlRouter);

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server is running at ${process.env.BASE}`);
    });
  } catch (err) {
    console.error(err.message, "root");
  }
})();
