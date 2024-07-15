import express from 'express';
import * as SampleController from './sample.controller.js';

const router = express.Router();

// Define routes for CRUD operations (modify paths as needed)
router.post('/', SampleController.createSample);
router.get('/', SampleController.getAllSamples);
router.get('/:id', SampleController.getSampleById);
router.put('/:id', SampleController.updateSample);
router.delete('/:id', SampleController.deleteSample);

export default router;
