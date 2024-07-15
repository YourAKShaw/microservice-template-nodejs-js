// eslint-disable-next-line no-unused-vars
import { ObjectId } from 'mongodb';

/**
 * Represents a sample.
 * @typedef {Object} Sample
 */
class Sample {
  id;
  sampleString;
  sampleNumber;
  sampleBoolean;

  /**
   * Represents a sample.
   * @constructor
   * @param {ObjectId} id - The id of the sample.
   * @param {boolean} sampleBoolean - The sampleBoolean of the sample.
   * @param {number} sampleNumber - The sampleNumber of the sample.
   * @param {string} sampleString - The sampleString of the sample.
   */
  constructor(id, sampleBoolean, sampleNumber, sampleString) {
    this.id = id;
    this.sampleBoolean = sampleBoolean;
    this.sampleNumber = sampleNumber;
    this.sampleString = sampleString;
  }
}

export default Sample;
