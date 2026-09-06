import mongoose from "mongoose";
// Imported as "node:dns" on purpose: with the bare "dns" specifier the bundler
// resolves this to a stub whose `setServers` silently does nothing, and the SRV
// lookup below then fails inside `next dev`.
import dns from "node:dns";

// Some networks (and some serverless runtimes) fail the SRV-record DNS lookup
// that `mongodb+srv://` connection strings rely on via Node's default
// resolver — even though the exact same record resolves fine through the OS's
// own resolver (`querySrv ECONNREFUSED`). Forcing known-good public DNS
// servers avoids that failure without requiring per-machine network changes.
dns.setServers(["8.8.8.8", "1.1.1.1"]);

// The cache is keyed by the URI it was opened with. `global.mongoose` survives
// dev-server hot reloads, so without the key a changed MONGODB_URI would keep
// silently serving the previous cluster's data until the process is restarted.
const cached = (global as any).mongoose ?? { conn: null, promise: null, uri: null };
(global as any).mongoose = cached;

export async function connectDB() {
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) throw new Error("Please define MONGODB_URI in .env.local");

  if (cached.uri && cached.uri !== MONGODB_URI) {
    // Point at the new cluster instead of reusing the stale connection.
    const stale = cached.conn;
    cached.conn = null;
    cached.promise = null;
    cached.uri = null;
    if (stale) await mongoose.disconnect().catch(() => {});
  }

  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.uri = MONGODB_URI;
    cached.promise = mongoose.connect(MONGODB_URI).then((m) => m).catch((err) => {
      cached.promise = null;
      cached.conn = null;
      cached.uri = null;
      throw err;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
