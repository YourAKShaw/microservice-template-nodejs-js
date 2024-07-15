import Joi from 'joi';

const createSampleSchema = Joi.object({
  sampleBoolean: Joi.boolean(),
  sampleNumber: Joi.number(),
  sampleString: Joi.string(),
}).required();

export default createSampleSchema;
