import { createLogger, format, transports } from 'winston';

const {
  colorize, combine, timestamp, label, printf,
} = format;

/**
 * Custom winston logger format
 */
const myFormat = printf((info: Record<string, unknown>) => {
  const { level, message, timestamp: infoTimestamp } = info;
  return `${infoTimestamp} [${level}]: ${message}`;
});

/**
 * Custom logger
 */
const logger = createLogger({
  level: 'verbose',
  format: combine(
    colorize(),
    label({ label: '' }),
    timestamp(),
    myFormat,
  ),
  exitOnError: true,
  transports: [
    new transports.Console(),
  ],
  exceptionHandlers: [
    new transports.Console(),
  ],
});

export default logger;
