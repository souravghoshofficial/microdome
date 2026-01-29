import fs from "fs";
import mongoose from "mongoose";
import { User } from "./models/user.model.js";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

async function run() {
  try {
    await mongoose.connect(MONGODB_URI, { dbName: "microdome" });
    console.log("MongoDB connected");

    const users = await User.find(
      { isPremiumMember: true },
      { name: 1, email: 1, _id: 0 }
    ).lean();

    fs.writeFileSync(
      "premiumUsers.json",
      JSON.stringify(users, null, 2),
      "utf-8"
    );

    console.log(`Exported ${users.length} users`);
  } catch (err) {
    console.error("Error exporting users:", err);
  } finally {
    await mongoose.disconnect();
  }
}

run();
