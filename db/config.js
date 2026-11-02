import { MongoClient } from "mongodb";
import "dotenv/config";

const uri = process.env.MONGO_URI;

if (!uri) {
  throw new Error("MONGO_URI is not defined in .env");
}

const client = new MongoClient(uri);

let dbConnection = null;

async function connectToDatabase() {
  try {
    await client.connect();

    dbConnection = client.db();

    console.log("Connected successfully to MongoDB");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    throw error;
  }
}

function getDB() {
  if (!dbConnection) {
    throw new Error("Database not connected");
  }

  return dbConnection;
}

export function getUsersCollection() {
  return getDB().collection("users");
}

export { connectToDatabase, getDB };
