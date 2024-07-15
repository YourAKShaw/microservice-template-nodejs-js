import ApiResponse from '../common/ApiResponse.js';
import * as SampleService from './sample.service.js';

// Controller functions to handle incoming requests and interact with the service

async function createSample(req, res) {
  try {
    const sampleData = req.body; // Assuming data is sent in the request body
    const id = await SampleService.createSample(sampleData);
    res
      .status(201)
      .json({ message: `Sample created successfully with ID: ${id}` });
    // res
    //   .status(201)
    //   .json(
    //     new ApiResponse({
    //       statusCode: 201,
    //       success: true,
    //       message: `Sample created successfully with ID: ${id}`,
    //       data: await SampleService.getSampleById(id),
    //       errors: [],
    //     }),
    //   );
  } catch (error) {
    res.status(500).json({ message: 'Error creating sample', error }); // Handle and log errors
  }
}

async function getAllSamples(req, res) {
  try {
    const samples = await SampleService.getAllSamples();
    res.json(samples);
  } catch (error) {
    res.status(500).json({ message: 'Error getting samples', error }); // Handle and log errors
  }
}

async function getSampleById(req, res) {
  const id = req.params.id;
  try {
    const sample = await SampleService.getSampleById(id);
    if (!sample) {
      return res.status(404).json({ message: 'Sample not found' });
    }
    res.json(sample);
  } catch (error) {
    res.status(500).json({ message: 'Error getting sample', error }); // Handle and log errors
  }
}

async function updateSample(req, res) {
  const id = req.params.id;
  const updatedData = req.body;
  try {
    const updateResult = await SampleService.updateSample(id, updatedData);
    if (!updateResult.sample) {
      return res
        .status(404)
        .json({ message: `Sample with id ${id} not found` });
    }
    if (updateResult.modifiedCount === 0) {
      return res.status(200).json({ message: 'Modified count is 0' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating sample', error }); // Handle and log errors
  }
}

async function deleteSample(req, res) {
  const id = req.params.id;
  try {
    const deletedCount = await SampleService.deleteSample(id);
    if (deletedCount === 0) {
      return res.status(404).json({ message: 'Sample not found' });
    }
    res.json({ message: 'Sample deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting sample', error }); // Handle and log errors
  }
}

export {
  createSample,
  getAllSamples,
  getSampleById,
  updateSample,
  deleteSample,
};
