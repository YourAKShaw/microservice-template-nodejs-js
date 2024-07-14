import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

import printAsciiArt from './common/helpers/printAsciiArt.js';
import app from './app.js';
import logger from './common/logger.js';

printAsciiArt();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  logger.info(`Server started on port ${PORT}`);
});
