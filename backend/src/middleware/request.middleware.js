const logger = require("../config/logger");

const requestLogger = (req, res, next) => {
  logger.info({
    endpoint: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString(),
  });
  next();
};

module.exports = requestLogger;
