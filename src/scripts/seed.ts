import mongoose from "mongoose";
import dns from "node:dns";
import bcrypt from "bcryptjs";
import { DEFAULT_COURSES } from "../lib/defaultCourses";
import { DEFAULT_SITE_CONTACT } from "../lib/siteContact";
import { posts as DEFAULT_BLOG_POSTS } from "../lib/blogData";

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

const CourseSchema = new mongoose.Schema(
  {
    title:         { type: String, required: true },
    slug:          { type: String, required: true, unique: true },
    description:   { type: String, required: true },
    image:         { type: String },
    ageGroup:      { type: String, default: "" },
    duration:      { type: String, default: "" },
    classDuration: { type: String, default: "" },
    bullets:       { type: [String], default: [] },
    status:        { type: String, enum: ["active", "inactive"], default: "active" },
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

// No `timestamps: true` here on purpose — the seed backdates createdAt/updatedAt
// to each article's original publish date so the ordering on the site is kept.
const BlogSchema = new mongoose.Schema({
  title:    { type: String, required: true },
  slug:     { type: String, required: true, unique: true },
  excerpt:  { type: String, required: true },
  image:    { type: String },
  category: { type: String, required: true },
  intro:    { type: String, required: true },
  sections: { type: [Object], default: [] },
  readTime: { type: String, default: "1 min read" },
  status:   { type: String, enum: ["draft", "published"], default: "published" },
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: true },
});

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log("✅ Connected to MongoDB");

  const User = mongoose.models.User || mongoose.model("User", UserSchema);
  const Course = mongoose.models.Course || mongoose.model("Course", CourseSchema);

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

  // Default courses (only when the collection is empty, so admin edits are never overwritten)
  const courseCount = await Course.countDocuments();
  if (courseCount > 0) {
    // Backfill the newer detail fields (age group, durations, bullets) onto
    // previously seeded courses that don't have them yet — matched by slug and
    // only when ageGroup is still empty, so admin edits are never overwritten.
    let backfilled = 0;
    for (const c of DEFAULT_COURSES) {
      const res = await Course.updateOne(
        { slug: c.slug, $or: [{ ageGroup: { $exists: false } }, { ageGroup: "" }, { ageGroup: null }] },
        { $set: { ageGroup: c.ageGroup ?? "", duration: c.duration ?? "", classDuration: c.classDuration ?? "", bullets: c.bullets ?? [] } }
      );
      backfilled += res.modifiedCount;
    }
    if (backfilled > 0) {
      console.log(`✅ Backfilled course details on ${backfilled} existing course(s)`);
    } else {
      console.log(`⚠️  ${courseCount} course(s) already exist. Skipping course seed.`);
    }
  } else {
    await Course.insertMany(
      DEFAULT_COURSES.map((c) => ({
        title: c.title,
        slug: c.slug,
        description: c.description,
        image: c.image,
        ageGroup: c.ageGroup ?? "",
        duration: c.duration ?? "",
        classDuration: c.classDuration ?? "",
        bullets: c.bullets ?? [],
        status: "active",
      }))
    );
    console.log(`✅ Seeded ${DEFAULT_COURSES.length} default courses`);
  }

  // Default blogs (only when the collection is empty, so admin edits are never overwritten)
  const BlogModel = mongoose.models.Blog || mongoose.model("Blog", BlogSchema);
  const blogCount = await BlogModel.countDocuments();
  if (blogCount > 0) {
    console.log(`⚠️  ${blogCount} blog(s) already exist. Skipping blog seed.`);
  } else {
    const blogDocs = DEFAULT_BLOG_POSTS.map((p) => {
      // Leading heading-less sections become the intro ("big description");
      // everything after the first heading stays as regular sections.
      const introParts: string[] = [];
      const sections: (typeof p.sections)[number][] = [];
      let inIntro = true;
      for (const s of p.sections) {
        if (inIntro && !s.heading && !s.arabic && !s.list) {
          introParts.push(s.body);
        } else {
          inIntro = false;
          sections.push(s);
        }
      }
      const created = new Date(p.date);
      return {
        title: p.title,
        slug: p.slug,
        excerpt: p.excerpt,
        image: p.image,
        category: p.category,
        intro: introParts.join("\n\n"),
        sections,
        readTime: p.readTime,
        status: "published",
        createdAt: created,
        updatedAt: created,
      };
    });
    await BlogModel.insertMany(blogDocs);
    console.log(`✅ Seeded ${blogDocs.length} default blogs`);
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
