const winston = require('winston');
require('winston-mongodb');
const path = require('path');
const fs = require('fs');

const { DB_URL } = process.env;

const srcDir = path.join(__dirname, '..');

const logDir = path.join(srcDir, 'logfiles');

// Create folder if not exists
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const logFile = path.join(
  logDir,
  `logfile_${new Date().toISOString().slice(0, 10)}.log`
);

const logger = winston.createLogger({
  transports: [
    new winston.transports.File({
      filename: logFile
    }),
    new winston.transports.MongoDB({
      db: DB_URL,
      level: 'error',
      collection: 'logs'
    })
  ]
});

module.exports = logger;
