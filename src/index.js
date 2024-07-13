import printAsciiArt from './common/helpers/printAsciiArt.js';
import app from './app.js';

printAsciiArt();

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
