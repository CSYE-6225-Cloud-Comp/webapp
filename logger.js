import winston from 'winston';
import { format } from 'winston';

const customFormat = winston.format.printf(({ timestamp, level, message }) => {
  return JSON.stringify({
    timestamp: timestamp,
    level: level,
    severity: level,
    message: message
  });
});

const logger = winston.createLogger({
  level: "info",
  format: format.combine(
    format.json(),
    format.timestamp(),
    customFormat
  ),
  transports: [
    new winston.transports.File({ filename: "/var/log/webapp/webapp.log" }),
  ],
})

export default logger;