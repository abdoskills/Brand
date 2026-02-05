import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI ?? "";

type MongoCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  var mongooseCache: MongoCache | undefined;
}

let cached = global.mongooseCache;

if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null };
}

export async function connectMongo() {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not set");
  }

  if (cached?.conn) {
    return cached.conn;
  }

  if (!cached?.promise) {
    cached!.promise = mongoose.connect(MONGODB_URI, {
      dbName: process.env.MONGODB_DB ?? undefined,
    });
  }

  cached!.conn = await cached!.promise;
  return cached!.conn;
}
