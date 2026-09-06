import mongoose from "mongoose";
import dns from "dns";

// Some networks (and some serverless runtimes) fail the SRV-record DNS lookup
// that `mongodb+srv://` connection strings rely on via Node's default
// resolver — even though the exact same record resolves fine through the OS's
// own resolver (`querySrv ECONNREFUSED`). Forcing known-good public DNS
// servers avoids that failure without requiring per-machine network changes.
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const cached = (global as any).mongoose ?? { conn: null, promise: null };
(global as any).mongoose = cached;

export async function connectDB() {
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) throw new Error("Please define MONGODB_URI in .env.local");

  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((m) => m).catch((err) => {
      cached.promise = null;
      cached.conn = null;
      throw err;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
