import { ObjectId } from 'mongodb';
import { getDb } from '../common/mongoClient.js';

let sampleCollection;

(async () => {
  const db = await getDb();
  sampleCollection = db.collection('samples');
})(); // Immediately Invoked Function Expression (IIFE) for collection creation

// Function to create a new sample document
async function createSample(sampleData) {
  try {
    const result = await sampleCollection.insertOne(sampleData);
    return result.insertedId; // Return the inserted document ID
  } catch (error) {
    console.error('Error creating sample:', error);
    throw error; // Re-throw the error for handling in the controller
  }
}

// Function to get all sample documents
async function getAllSamples() {
  try {
    const samples = await sampleCollection.find().toArray();
    return samples;
  } catch (error) {
    console.error('Error getting samples:', error);
    throw error; // Re-throw the error for handling in the controller
  }
}

// Function to get a sample document by ID
async function getSampleById(id) {
  try {
    const sampleId = new ObjectId(id); // Convert string ID to ObjectId
    const sample = await sampleCollection.findOne({ _id: sampleId });
    return sample;
  } catch (error) {
    console.error('Error getting sample by ID:', error);
    throw error; // Re-throw the error for handling in the controller
  }
}

// Function to update a sample document by ID
async function updateSample(id, updatedData) {
  try {
    const sampleId = new ObjectId(id); // Convert string ID to ObjectId
    const result = await sampleCollection.updateOne(
      { _id: sampleId },
      { $set: updatedData },
    );
    return result.modifiedCount; // Return the number of documents modified (should be 1)
  } catch (error) {
    console.error('Error updating sample:', error);
    throw error; // Re-throw the error for handling in the controller
  }
}

// Function to delete a sample document by ID
async function deleteSample(id) {
  try {
    const sampleId = new ObjectId(id); // Convert string ID to ObjectId
    const result = await sampleCollection.deleteOne({ _id: sampleId });
    return result.deletedCount; // Return the number of documents deleted (should be 1)
  } catch (error) {
    console.error('Error deleting sample:', error);
    throw error; // Re-throw the error for handling in the controller
  }
}

export {
  createSample,
  getAllSamples,
  getSampleById,
  updateSample,
  deleteSample,
};
