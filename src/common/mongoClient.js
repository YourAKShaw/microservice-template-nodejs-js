import { MongoClient } from 'mongodb';
import logger from './logger.js';
let client; // Variable to hold the MongoClient instance

async function connectToDb() {
  if (!client) {
    client = await new MongoClient(process.env.MONGODB_URI).connect();
    logger.success('Connected to MongoDB!');
  }
  return client;
}

export async function getDb() {
  const connectedClient = await connectToDb();
  return connectedClient.db('test'); // Assuming 'test' is your database name
}
