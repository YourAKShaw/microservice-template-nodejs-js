import * as emoji from 'node-emoji';
import winston from 'winston';

// Create a custom formatter with improved readability
const myFormat = winston.format.printf((info) => {
  let emojiToLog = '';
  switch (info.level) {
    case '\x1B[32minfo\x1B[39m':
      emojiToLog = emoji.get('white_check_mark');
      break;
    case '\x1B[31merror\x1B[39m':
      emojiToLog = emoji.get('x');
      break;
    default:
      emojiToLog = emoji.get('grey_exclamation'); // Handle other log levels (optional)
  }

  return (
    `[${info.timestamp}] ${emojiToLog} [${info.level}]: ${info.message}` +
    (info.splat !== undefined ? `${info.splat}` : ' ')
  );
});

const logger = winston.createLogger({
  transports: [new winston.transports.Console()],
  format: winston.format.combine(
    winston.format.colorize({ all: true }),
    winston.format.simple(),
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    myFormat, // Use the custom formatter
  ),
});

export default logger; // Export the logger as default
