var appRoot = require('app-root-path');
const {
  createLogger,
  format,
  transports
} = require('winston');

function getLogger(module) {

  const {
    combine,
    timestamp,
    label,
    prettyPrint
  } = format;
  // instantiate a new Winston Logger with the settings defined above
  return logger = createLogger({
    format: combine(
      label({
        label: `${module.filename}`
      }),
      timestamp(),
      prettyPrint()
    ),
    transports: [
      new transports.File({
        level: 'info',
        filename: `${appRoot}/logs/server.log`,
        handleExceptions: true,
        json: true,
        maxsize: 5242880, // 5MB
        maxFiles: 10,
        colorize: false
      })
  ],
    exitOnError: true, // do not exit on handled exceptions
  });
}

module.exports = getLogger;
