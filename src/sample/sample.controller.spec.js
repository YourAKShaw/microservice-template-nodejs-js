import request from 'supertest';
import express from 'express';
import createHttpError from 'http-errors';
import * as SampleController from './sample.controller.js';
import * as SampleService from './sample.service.js';
import ApiResponse from '../common/ApiResponse.js';

jest.mock('../common/logger.js', () => ({
  error: jest.fn(),
}));

const app = express();
app.use(express.json());

// Sample routes for testing
app.post('/samples', SampleController.createSample);
app.get('/samples', SampleController.getAllSamples);
app.get('/samples/:id', SampleController.getSampleById);
app.put('/samples/:id', SampleController.updateSample);
app.delete('/samples/:id', SampleController.deleteSample);

describe('SampleController', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createSample', () => {
    it('should create a sample and return 201', async () => {
      const sampleData = { name: 'Sample' };
      const createdSample = { id: '1', ...sampleData };
      SampleService.createSample = jest
        .fn()
        .mockResolvedValue(createdSample.id);
      SampleService.getSampleById = jest.fn().mockResolvedValue(createdSample);

      const response = await request(app).post('/samples').send(sampleData);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(
        expect.objectContaining({
          statusCode: 201,
          success: true,
          message: `Sample created successfully with ID: ${createdSample.id}`,
          data: createdSample,
        }),
      );
      expect(SampleService.createSample).toHaveBeenCalledWith(sampleData);
    });

    it('should return 400 if validation fails', async () => {
      const sampleData = {}; // Invalid data
      const validationError = { message: 'Validation error' };
      const {
        createSampleSchema,
      } = require('./schema/create-sample.schema.js');
      createSampleSchema.validate = jest
        .fn()
        .mockReturnValue({ error: validationError });

      const response = await request(app).post('/samples').send(sampleData);

      expect(response.status).toBe(400);
      expect(response.body).toEqual(
        expect.objectContaining({
          statusCode: 400,
          success: false,
          message: validationError.message,
        }),
      );
    });

    it('should return 500 if service throws an error', async () => {
      const sampleData = { name: 'Sample' };
      SampleService.createSample = jest
        .fn()
        .mockRejectedValue(new Error('Service error'));

      const response = await request(app).post('/samples').send(sampleData);

      expect(response.status).toBe(500);
      expect(response.body).toEqual(
        expect.objectContaining({
          statusCode: 500,
          success: false,
          message: 'Error creating sample',
        }),
      );
    });
  });

  describe('getAllSamples', () => {
    it('should return all samples and return 200', async () => {
      const samples = [{ id: '1', name: 'Sample' }];
      SampleService.getAllSamples = jest.fn().mockResolvedValue(samples);

      const response = await request(app).get('/samples');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(
        expect.objectContaining({
          statusCode: 200,
          success: true,
          message: 'All samples retrieved',
          data: samples,
        }),
      );
      expect(SampleService.getAllSamples).toHaveBeenCalled();
    });

    it('should return 500 if service throws an error', async () => {
      SampleService.getAllSamples = jest
        .fn()
        .mockRejectedValue(new Error('Service error'));

      const response = await request(app).get('/samples');

      expect(response.status).toBe(500);
      expect(response.body).toEqual(
        expect.objectContaining({
          statusCode: 500,
          success: false,
          message: 'Error getting samples',
        }),
      );
    });
  });

  describe('getSampleById', () => {
    it('should return a sample by id and return 200', async () => {
      const sample = { id: '1', name: 'Sample' };
      SampleService.getSampleById = jest.fn().mockResolvedValue(sample);

      const response = await request(app).get('/samples/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(
        expect.objectContaining({
          statusCode: 200,
          success: true,
          message: `Sample with id ${sample.id} retrieved`,
          data: sample,
        }),
      );
      expect(SampleService.getSampleById).toHaveBeenCalledWith('1');
    });

    it('should return 404 if sample not found', async () => {
      SampleService.getSampleById = jest.fn().mockResolvedValue(null);

      const response = await request(app).get('/samples/1');

      expect(response.status).toBe(404);
      expect(response.body).toEqual(
        expect.objectContaining({
          statusCode: 404,
          success: false,
          message: 'Sample with id 1 not found',
        }),
      );
    });

    it('should return 500 if service throws an error', async () => {
      SampleService.getSampleById = jest
        .fn()
        .mockRejectedValue(new Error('Service error'));

      const response = await request(app).get('/samples/1');

      expect(response.status).toBe(500);
      expect(response.body).toEqual(
        expect.objectContaining({
          statusCode: 500,
          success: false,
          message: 'Error getting sample',
        }),
      );
    });
  });

  describe('updateSample', () => {
    it('should update a sample and return 200', async () => {
      const sampleData = { name: 'Updated Sample' };
      const updatedSample = { id: '1', ...sampleData };
      SampleService.updateSample = jest
        .fn()
        .mockResolvedValue({ modifiedCount: 1, sample: updatedSample });

      const response = await request(app).put('/samples/1').send(sampleData);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(
        expect.objectContaining({
          statusCode: 200,
          success: true,
          message: `Sample with id 1 updated/replaced using PUT operation`,
          data: updatedSample,
        }),
      );
      expect(SampleService.updateSample).toHaveBeenCalledWith('1', sampleData);
    });

    it('should return 400 if validation fails', async () => {
      const sampleData = {}; // Invalid data
      const validationError = { message: 'Validation error' };
      const {
        updateSampleSchema,
      } = require('./schema/update-sample.schema.js');
      updateSampleSchema.validate = jest
        .fn()
        .mockReturnValue({ error: validationError });

      const response = await request(app).put('/samples/1').send(sampleData);

      expect(response.status).toBe(400);
      expect(response.body).toEqual(
        expect.objectContaining({
          statusCode: 400,
          success: false,
          message: validationError.message,
        }),
      );
    });

    it('should return 500 if service throws an error', async () => {
      const sampleData = { name: 'Sample' };
      SampleService.updateSample = jest
        .fn()
        .mockRejectedValue(new Error('Service error'));

      const response = await request(app).put('/samples/1').send(sampleData);

      expect(response.status).toBe(500);
      expect(response.body).toEqual(
        expect.objectContaining({
          statusCode: 500,
          success: false,
          message: 'Error updating sample',
        }),
      );
    });
  });

  describe('deleteSample', () => {
    it('should delete a sample and return 200', async () => {
      SampleService.deleteSample = jest
        .fn()
        .mockResolvedValue({ deletedCount: 1 });

      const response = await request(app).delete('/samples/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(
        expect.objectContaining({
          statusCode: 200,
          success: true,
          message: 'Sample deleted successfully',
        }),
      );
      expect(SampleService.deleteSample).toHaveBeenCalledWith('1');
    });

    it('should return 404 if sample not found', async () => {
      SampleService.deleteSample = jest
        .fn()
        .mockResolvedValue({ deletedCount: 0 });

      const response = await request(app).delete('/samples/1');

      expect(response.status).toBe(404);
      expect(response.body).toEqual(
        expect.objectContaining({
          statusCode: 404,
          success: false,
          message: 'Sample not found',
        }),
      );
    });

    it('should return 500 if service throws an error', async () => {
      SampleService.deleteSample = jest
        .fn()
        .mockRejectedValue(new Error('Service error'));

      const response = await request(app).delete('/samples/1');

      expect(response.status).toBe(500);
      expect(response.body).toEqual(
        expect.objectContaining({
          statusCode: 500,
          success: false,
          message: 'Error deleting sample',
        }),
      );
    });
  });
});
