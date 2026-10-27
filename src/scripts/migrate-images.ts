import mongoose from "mongoose";
import dns from "node:dns";

// One-off migration: converts images stored as base64 data URIs (`image`) into
// binary (`imageFile: { data, contentType }`) for blogs, courses and users.
// Safe to re-run — it only touches documents whose `image` is still a data URI,
// and it writes the binary copy and removes the old string in a single update.
//
//   npm run migrate:images            convert
//   npm run migrate:images -- --dry   only report what would change

// Same public-DNS override as seed.ts / connectDB() for `mongodb+srv://`.
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const MONGODB_URI = process.env.MONGODB_URI || "";
const DRY_RUN = process.argv.includes("--dry");

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI is not set in .env.local");
  process.exit(1);
}

const COLLECTIONS = ["blogs", "courses", "users"];

async function migrate() {
  await mongoose.connect(MONGODB_URI);
  console.log(`✅ Connected to MongoDB${DRY_RUN ? " (dry run)" : ""}`);

  for (const name of COLLECTIONS) {
    const col = mongoose.connection.collection(name);
    const docs = col.find({ image: { $regex: /^data:/ } }, { projection: { image: 1 } });

    let converted = 0;
    let skipped = 0;
    let bytes = 0;

    for await (const doc of docs) {
      const match = /^data:([^;]+);base64,([\s\S]*)$/.exec(String(doc.image));
      if (!match) {
        skipped++;
        console.warn(`⚠️  ${name}/${doc._id}: unrecognised data URI, left as is`);
        continue;
      }

      const data = Buffer.from(match[2], "base64");
      bytes += data.length;

      if (!DRY_RUN) {
        await col.updateOne(
          { _id: doc._id },
          { $set: { imageFile: { data, contentType: match[1] } }, $unset: { image: "" } }
        );
      }
      converted++;
    }

    console.log(
      `${name}: ${converted} ${DRY_RUN ? "to convert" : "converted"} (${(bytes / 1024 / 1024).toFixed(2)} MB)` +
        (skipped ? `, ${skipped} skipped` : "")
    );
  }

  await mongoose.disconnect();
  process.exit(0);
}

migrate().catch((err) => {
  console.error("❌ Migration failed:", err.message);
  process.exit(1);
});
