import mongoose from "mongoose";
import dns from "node:dns";
import bcrypt from "bcryptjs";
import { DEFAULT_SITE_CONTACT } from "../lib/siteContact";

// This script connects directly instead of going through `connectDB()`, so it
// needs the same public-DNS override: the local resolver refuses the SRV
// lookup that `mongodb+srv://` depends on (`querySrv ECONNREFUSED`).
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const MONGODB_URI = process.env.MONGODB_URI || "";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "";

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI is not set in .env.local");
  process.exit(1);
}

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error("❌ ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env.local");
  process.exit(1);
}

const UserSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true },
    email:    { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role:     { type: String, enum: ["admin", "superadmin"], default: "admin" },
    image:    { type: String, default: "" },
  },
  { timestamps: true }
);

const SiteContactSchema = new mongoose.Schema(
  {
    phone:    { type: String, required: true },
    whatsapp: { type: String, required: true },
    email:    { type: String, required: true },
  },
  { timestamps: true }
);

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log("✅ Connected to MongoDB");

  const User = mongoose.models.User || mongoose.model("User", UserSchema);

  // Admin user
  const existing = await User.findOne({ email: ADMIN_EMAIL });
  if (existing) {
    console.log("⚠️  Admin already exists. Skipping admin seed.");
  } else {
    const hashed = await bcrypt.hash(ADMIN_PASSWORD, 10);
    await User.create({
      name:     "Admin",
      email:    ADMIN_EMAIL,
      password: hashed,
      role:     "superadmin",
    });
    console.log("✅ Admin user created");
  }

  // Site contact info (singleton — seeded from the frontend defaults)
  const SiteContact = mongoose.models.SiteContact || mongoose.model("SiteContact", SiteContactSchema);
  const contactExists = await SiteContact.findOne();
  if (contactExists) {
    console.log("⚠️  Site contact info already exists. Skipping contact seed.");
  } else {
    await SiteContact.create(DEFAULT_SITE_CONTACT);
    console.log("✅ Seeded default site contact info");
  }

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err.message);
  process.exit(1);
});
