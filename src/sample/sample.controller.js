import createHttpError from 'http-errors';
import ApiResponse from '../common/ApiResponse.js';
import logger from '../common/logger.js';
import * as SampleService from './sample.service.js';
import createSampleSchema from './schema/create-sample.schema.js';
import updateSampleSchema from './schema/update-sample.schema.js';

// Controller functions to handle incoming requests and interact with the service

async function createSample(req, res, next) {
  try {
    const sampleData = req.body; // Assuming data is sent in the request body
    const { error } = createSampleSchema.validate(sampleData);
    if (error) {
      logger.error(error.message);
      return next(createHttpError(400, error.message));
    }
    const id = await SampleService.createSample(sampleData);
    res.status(201).json(
      new ApiResponse({
        statusCode: 201,
        success: true,
        message: `Sample created successfully with ID: ${id}`,
        data: await SampleService.getSampleById(id),
        errors: [],
      }),
    );
  } catch (error) {
    logger.error('[SampleController] Error creating sample');
    res.status(500).json(
      new ApiResponse({
        statusCode: 500,
        success: false,
        message: 'Error creating sample',
        data: null,
        errors: error,
      }),
    );
  }
}

async function getAllSamples(req, res) {
  try {
    const samples = await SampleService.getAllSamples();
    res.status(200).json(
      new ApiResponse({
        statusCode: 200,
        success: true,
        message: 'All samples retrieved',
        data: samples,
        errors: [],
      }),
    );
  } catch (error) {
    logger.error('[SampleController] Error getting samples');
    res.status(500).json(
      new ApiResponse({
        statusCode: 500,
        success: false,
        message: 'Error getting samples',
        data: null,
        errors: error,
      }),
    );
  }
}

async function getSampleById(req, res) {
  const id = req.params.id;
  try {
    const sample = await SampleService.getSampleById(id);
    if (!sample) {
      return res.status(404).json(
        new ApiResponse({
          statusCode: 404,
          success: false,
          message: `Sample with id ${id} not found`,
          data: null,
          errors: [],
        }),
      );
    }
    res.status(200).json(
      new ApiResponse({
        statusCode: 200,
        success: true,
        message: `Sample with id ${id} retrieved`,
        data: sample,
        errors: [],
      }),
    );
  } catch (error) {
    res.status(500).json(
      new ApiResponse({
        statusCode: 500,
        success: false,
        message: 'Error getting sample',
        data: null,
        errors: error,
      }),
    );
  }
}

async function updateSample(req, res, next) {
  const id = req.params.id;
  const updatedData = req.body;
  const { error } = updateSampleSchema.validate(updatedData);
  if (error) {
    logger.error(error.message);
    return next(createHttpError(400, error.message));
  }
  try {
    const updateResult = await SampleService.updateSample(id, updatedData);

    if (updateResult.modifiedCount === 0) {
      return res.status(200).json(
        new ApiResponse({
          statusCode: 200,
          success: true,
          message: 'Modified count is 0',
          data: updateResult.sample,
          errors: [],
        }),
      );
    }

    if (updateResult.sample) {
      return res.status(200).json(
        new ApiResponse({
          statusCode: 200,
          success: true,
          message: `Sample with id ${id} updated/replaced using PUT operation`,
          data: updateResult.sample,
          errors: [],
        }),
      );
    }
  } catch (error) {
    res.status(500).json(
      new ApiResponse({
        statusCode: 500,
        success: false,
        message: 'Error updating sample',
        data: null,
        errors: error,
      }),
    );
  }
}

async function deleteSample(req, res) {
  const id = req.params.id;
  try {
    const deleteResult = await SampleService.deleteSample(id);
    if (deleteResult.deletedCount === 0) {
      return res.status(404).json(
        new ApiResponse({
          statusCode: 404,
          success: false,
          message: 'Sample not found',
          data: null,
          errors: [],
        }),
      );
    }
    res.status(200).json(
      new ApiResponse({
        statusCode: 200,
        success: true,
        message: 'Sample deleted successfully',
        data: deleteResult.sample,
        errors: [],
      }),
    );
  } catch (error) {
    res.status(500).json(
      new ApiResponse({
        statusCode: 500,
        success: false,
        message: 'Error deleting sample',
        data: null,
        errors: error,
      }),
    );
  }
}

export {
  createSample,
  getAllSamples,
  getSampleById,
  updateSample,
  deleteSample,
};
