import Joi from 'joi';

const updateSampleSchema = Joi.object({
  sampleBoolean: Joi.boolean(),
  sampleNumber: Joi.number(),
  sampleString: Joi.string(),
}).required();

export default updateSampleSchema;
