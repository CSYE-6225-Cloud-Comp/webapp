import winston from 'winston';
import { format } from 'winston';

const logger = winston.createLogger({
  level: "info",
  format: format.combine(
    format.json(),
    format.timestamp({
        format: () => {
            const now = new Date();
            const isoString = now.toISOString();
            // Extract milliseconds and time zone from ISO string
            const milliseconds = isoString.slice(20, 23);
            const timeZone = isoString.slice(23);
            return `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}T${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}.${milliseconds}${timeZone}`;
          }
          
    }),
    format.printf(({ timestamp, level, message }) => `{ ${timestamp} [${level.toUpperCase()}] (${winston.config.npm.levels[level]}) ${message} }`)
  ),
  transports: [
    new winston.transports.File({ filename: "/var/log/webapp/webapp.log" }),
  ],
})


export default logger;