import { MongoClient } from "mongodb";
import "dotenv/config";

const uri = process.env.MONGO_URI || "uri";

const client = new MongoClient(uri);

let dbConnection = null;

async function connectToDatabase() {
  try {
    await client.connect();
    console.log("Connected succefully to mongoDB");
    dbConnection = client.db();
  } catch (error) {
    console.error("Failed to connect to mongoDB", error);
    throw error;
  }
}

function getDB() {
  if (!dbConnection) {
    throw new Error("Database not connected");
  }

  return dbConnection;
}

export { connectToDatabase, getDB };
