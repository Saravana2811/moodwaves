  import express from "express";
  import mongoose from "mongoose";
  import cors from "cors";
  import dotenv from "dotenv";

  import authRoutes from "./routes/authRoutes.js";
  import messageRoutes from "./routes/messageRoutes.js";

  dotenv.config();
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());

  // ---------- REPLACED: improved MongoDB connection (use existing mongoose import) ----------
  const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/moodtunes";

  async function connectDB() {
    try {
      // mongoose v7+ accepts just the uri in most cases
      await mongoose.connect(mongoUri);
      console.log(
        "✅ MongoDB Connected:",
        mongoUri.startsWith("mongodb+srv") ? "Atlas (mongodb+srv)" : mongoUri
      );
    } catch (err) {
      console.error("❌ MongoDB Error:", err.message || err);
      if (!process.env.MONGO_URI) {
        console.error(
          "Hint: MONGO_URI not set. Create backend/.env with:\n" +
          "  MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority\n" +
          "Also ensure Atlas Network Access allows your IP."
        );
      } else {
        console.error("Hint: Check MONGO_URI credentials and Atlas IP whitelist.");
      }
      process.exit(1); // fail fast so the developer can fix the connection
    }
  }

  connectDB();
  // -------------------------------------------------------------------------------

  // Routes
  app.use("/api/auth", authRoutes);
  app.use("/api/messages", messageRoutes);

  // Server listen
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
