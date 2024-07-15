import logger from '../common/logger.js';
import * as SampleModel from './sample.model.js';

// Service functions to encapsulate business logic and interact with the model

async function createSample(sampleData) {
  try {
    const id = await SampleModel.createSample(sampleData);
    logger.success(`Sample created successfully with ID: ${id}`);
    return id;
  } catch (error) {
    logger.error('Error creating sample:', error);
    throw error; // Re-throw the error for handling in the controller
  }
}

async function getAllSamples() {
  try {
    const samples = await SampleModel.getAllSamples();
    logger.info('All samples retrieved');
    return samples;
  } catch (error) {
    logger.error('Error getting samples:', error);
    throw error;
  }
}

async function getSampleById(id) {
  try {
    const sample = await SampleModel.getSampleById(id);
    if (!sample) {
      return null; // Handle case where sample is not found (optional)
    }
    logger.info(`Sample with id ${id} retrieved`);
    return sample;
  } catch (error) {
    logger.error('Error getting sample by ID:', error);
    throw error; // Re-throw the error for handling in the controller
  }
}

async function updateSample(id, updatedData) {
  try {
    const sample = await getSampleById(id);
    const modifiedCount = await SampleModel.updateSample(id, updatedData);
    if (modifiedCount > 0) {
      logger.success(
        `Sample with id ${id} updated/replaced using PUT operation`,
      );
    }
    
    // Handle case where sample is not found or is identical to the request body
    if (modifiedCount === 0) {
      logger.info(`ModifiedCount is 0 for sample document with id ${id}`);
    }

    if (!sample) {
      logger.error(`sample with id ${id} not found`);
    }

    return { sample, modifiedCount };
  } catch (error) {
    logger.error('Error updating sample:', error);
    throw error; // Re-throw the error for handling in the controller
  }
}

async function deleteSample(id) {
  try {
    const sample = await getSampleById(id);
    const deletedCount = await SampleModel.deleteSample(id);
    if (deletedCount > 0) {
      logger.info(`Sample with id ${id} deleted`);
    } else {
      logger.error(`Sample wigh id ${id} not found`);
    }
    return { sample, deletedCount };
  } catch (error) {
    logger.error('Error deleting sample:', error);
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
