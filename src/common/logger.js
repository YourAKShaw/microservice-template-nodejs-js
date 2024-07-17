import * as emoji from 'node-emoji';
import winston from 'winston';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

// Define custom levels (adjust as needed)
const customLevels = {
  levels: {
    crit: 0,
    error: 1,
    warn: 2,
    debug: 3,
    verbose: 4,
    success: 5,
    info: 6,
  },
  colors: {
    crit: 'italic bold magentaBG',
    error: 'italic bold redBG',
    warn: 'italic yellow',
    debug: 'italic blue',
    verbose: 'dim italic cyan',
    success: 'italic green',
    info: 'italic grey',
  },
};

// Apply custom colors to winston
winston.addColors(customLevels.colors);

// Create a custom formatter with emojis
const myFormat = winston.format.printf((info) => {
  let emojiToLog = '';
  // eslint-disable-next-line no-control-regex
  const level = info.level.replace(/\x1B\[[0-9;]*m/g, ''); // Remove color codes for comparison
  switch (level) {
    case 'crit':
      emojiToLog = emoji.get('skull'); // Critical level emoji (example)
      break;
    case 'error':
      emojiToLog = emoji.get('x');
      break;
    case 'warn':
      emojiToLog = emoji.get('rotating_light');
      break;
    case 'debug':
      emojiToLog = emoji.get('bug');
      break;
    case 'verbose':
      emojiToLog = emoji.get('eye') + ' '; //* extra space as this emoji seems to eat up a white space, causing inconsistent formatting
      break;
    case 'success':
      emojiToLog = emoji.get('white_check_mark');
      break;
    case 'info':
      emojiToLog = emoji.get('information_source') + ' '; //* extra space as this emoji seems to eat up a white space, causing inconsistent formatting
      break;
    default:
      emojiToLog = emoji.get('grey_question'); // Handle other levels (optional)
  }
  return (
    `[${info.timestamp}] ${emojiToLog} [${info.level}]: ${info.message}` +
    (info.splat !== undefined ? `${info.splat}` : ' ')
  );
});

// Define different transports with specific formats
const consoleTransport = new winston.transports.Console({
  format: winston.format.combine(
    winston.format.colorize({ all: true }),
    winston.format.timestamp(),
    myFormat,
  ),
});

const fileTransport = new winston.transports.File({
  filename: 'combined.log',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
});

let logger = null;
if (process.env.NODE_ENV === 'production') {
  // Create a logger with custom levels, formats, and transports
  logger = winston.createLogger({
    defaultMeta: { service: 'template-service' },
    levels: customLevels.levels,
    transports: [consoleTransport, fileTransport], // Combine console and file transports
    format: winston.format.combine(winston.format.timestamp(), myFormat), // Default format for all transports
  });
} else {
  //* If we're not in production then log to the `console` with the format:
  //* `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
  logger = winston.createLogger({
    defaultMeta: { service: 'template-service' },
    levels: customLevels.levels,
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({ filename: 'combined.log' }),
    ],
    format: winston.format.simple(),
  });
}

// Overriding the log methods to use custom levels
Object.keys(customLevels.levels).forEach((level) => {
  logger[level] = (message) => logger.log(level, message);
});

export default logger;
