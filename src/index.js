import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

import printAsciiArt from './common/helpers/printAsciiArt.js';
import app from './app.js';

printAsciiArt();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
