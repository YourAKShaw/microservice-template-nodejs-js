import * as SampleService from './sample.service.js';
import * as SampleModel from './sample.model.js';
import logger from '../common/logger.js';

// Mock the logger
jest.mock('../common/logger.js', () => ({
  success: jest.fn(),
  info: jest.fn(),
  error: jest.fn(),
}));

// Mock the SampleModel methods
jest.mock('./sample.model.js', () => ({
  createSample: jest.fn(),
  getAllSamples: jest.fn(),
  getSampleById: jest.fn(),
  updateSample: jest.fn(),
  deleteSample: jest.fn(),
}));

describe('SampleService', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  describe('createSample', () => {
    it('should create a sample and log success', async () => {
      const sampleData = { name: 'test sample' };
      const sampleId = '123';
      SampleModel.createSample.mockResolvedValue(sampleId);

      const result = await SampleService.createSample(sampleData);

      expect(result).toBe(sampleId);
      expect(SampleModel.createSample).toHaveBeenCalledWith(sampleData);
      expect(logger.success).toHaveBeenCalledWith(
        `Sample created successfully with ID: ${sampleId}`,
      );
    });

    it('should log error and throw if creation fails', async () => {
      const sampleData = { name: 'test sample' };
      const error = new Error('Creation failed');
      SampleModel.createSample.mockRejectedValue(error);

      await expect(SampleService.createSample(sampleData)).rejects.toThrow(
        error,
      );
      expect(logger.error).toHaveBeenCalledWith(
        'Error creating sample:',
        error,
      );
    });
  });

  describe('getAllSamples', () => {
    it('should retrieve all samples and log info', async () => {
      const samples = [{ id: '123', name: 'test sample' }];
      SampleModel.getAllSamples.mockResolvedValue(samples);

      const result = await SampleService.getAllSamples();

      expect(result).toBe(samples);
      expect(SampleModel.getAllSamples).toHaveBeenCalled();
      expect(logger.info).toHaveBeenCalledWith('All samples retrieved');
    });

    it('should log error and throw if retrieval fails', async () => {
      const error = new Error('Retrieval failed');
      SampleModel.getAllSamples.mockRejectedValue(error);

      await expect(SampleService.getAllSamples()).rejects.toThrow(error);
      expect(logger.error).toHaveBeenCalledWith(
        'Error getting samples:',
        error,
      );
    });
  });

  describe('getSampleById', () => {
    it('should retrieve a sample by ID and log info', async () => {
      const sample = { id: '123', name: 'test sample' };
      SampleModel.getSampleById.mockResolvedValue(sample);

      const result = await SampleService.getSampleById('123');

      expect(result).toBe(sample);
      expect(SampleModel.getSampleById).toHaveBeenCalledWith('123');
      expect(logger.info).toHaveBeenCalledWith('Sample with id 123 retrieved');
    });

    it('should return null if sample is not found', async () => {
      SampleModel.getSampleById.mockResolvedValue(null);

      const result = await SampleService.getSampleById('123');

      expect(result).toBeNull();
    });

    it('should log error and throw if retrieval by ID fails', async () => {
      const error = new Error('Retrieval by ID failed');
      SampleModel.getSampleById.mockRejectedValue(error);

      await expect(SampleService.getSampleById('123')).rejects.toThrow(error);
      expect(logger.error).toHaveBeenCalledWith(
        'Error getting sample by ID:',
        error,
      );
    });
  });

  describe('updateSample', () => {
    it('should update a sample and log success', async () => {
      const sample = { id: '123', name: 'test sample' };
      const updatedData = { name: 'updated sample' };
      SampleService.getSampleById = jest.fn().mockResolvedValue(sample);
      SampleModel.updateSample.mockResolvedValue(1);

      const result = await SampleService.updateSample('123', updatedData);

      expect(result).toEqual({ sample, modifiedCount: 1 });
      expect(SampleService.getSampleById).toHaveBeenCalledWith('123');
      expect(SampleModel.updateSample).toHaveBeenCalledWith('123', updatedData);
      expect(logger.success).toHaveBeenCalledWith(
        'Sample with id 123 updated/replaced using PUT operation',
      );
    });

    it('should log info if modifiedCount is 0', async () => {
      const sample = { id: '123', name: 'test sample' };
      const updatedData = { name: 'updated sample' };
      SampleService.getSampleById = jest.fn().mockResolvedValue(sample);
      SampleModel.updateSample.mockResolvedValue(0);

      const result = await SampleService.updateSample('123', updatedData);

      expect(result).toEqual({ sample, modifiedCount: 0 });
      expect(logger.info).toHaveBeenCalledWith(
        'ModifiedCount is 0 for sample document with id 123',
      );
    });

    it('should log error if sample is not found', async () => {
      const updatedData = { name: 'updated sample' };
      SampleService.getSampleById = jest.fn().mockResolvedValue(null);
      SampleModel.updateSample.mockResolvedValue(0);

      const result = await SampleService.updateSample('123', updatedData);

      expect(result).toEqual({ sample: null, modifiedCount: 0 });
      expect(logger.error).toHaveBeenCalledWith('sample with id 123 not found');
    });

    it('should log error and throw if update fails', async () => {
      const error = new Error('Update failed');
      SampleService.getSampleById = jest.fn().mockRejectedValue(error);

      await expect(SampleService.updateSample('123', {})).rejects.toThrow(
        error,
      );
      expect(logger.error).toHaveBeenCalledWith(
        'Error updating sample:',
        error,
      );
    });
  });

  describe('deleteSample', () => {
    it('should delete a sample and log info', async () => {
      const sample = { id: '123', name: 'test sample' };
      SampleService.getSampleById = jest.fn().mockResolvedValue(sample);
      SampleModel.deleteSample.mockResolvedValue(1);

      const result = await SampleService.deleteSample('123');

      expect(result).toEqual({ sample, deletedCount: 1 });
      expect(SampleService.getSampleById).toHaveBeenCalledWith('123');
      expect(SampleModel.deleteSample).toHaveBeenCalledWith('123');
      expect(logger.info).toHaveBeenCalledWith('Sample with id 123 deleted');
    });

    it('should log error if sample is not found', async () => {
      const sample = { id: '123', name: 'test sample' };
      SampleService.getSampleById = jest.fn().mockResolvedValue(sample);
      SampleModel.deleteSample.mockResolvedValue(0);

      const result = await SampleService.deleteSample('123');

      expect(result).toEqual({ sample, deletedCount: 0 });
      expect(logger.error).toHaveBeenCalledWith('Sample wigh id 123 not found');
    });

    it('should log error and throw if deletion fails', async () => {
      const error = new Error('Deletion failed');
      SampleService.getSampleById = jest.fn().mockRejectedValue(error);

      await expect(SampleService.deleteSample('123')).rejects.toThrow(error);
      expect(logger.error).toHaveBeenCalledWith(
        'Error deleting sample:',
        error,
      );
    });
  });
});
