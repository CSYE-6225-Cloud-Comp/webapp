import winston from 'winston';
import { format } from 'winston';
import moment from 'moment-timezone';

const customFormat = winston.format.printf(({ timestamp, level, message }) => {
  return JSON.stringify({
    timestamp: timestamp,
    level: level,
    severity: level,
    message: message
  });
});

moment.tz('America/New_York').format('z');

const logger = winston.createLogger({
  level: "info",
  format: format.combine(
    format.json(),
    format.timestamp({format: moment().format('YYYY-MM-DDTHH:mm:ss.SSS')}),
    customFormat
  ),
  transports: [
    new winston.transports.File({ filename: "/var/log/webapp/webapp.log" }),
  ],
})


export default logger;