const errorLogger = (error, req, res, next) => {
  console.error("Error:", error);
  next(error);
};

const errorParser = (error, req, res, next) => {
  if (error.status === 404) {
    return res.status(404).json({ error: "Not Found", message: "The requested resource was not found." });
  }

  if (error.status === 400 || (error.errors && error.errors.some(err => err.type === "notNull Violation"))) {
    return res.status(400).json({ error: "Bad Request", message: "Invalid request. Check your input data." });
  }

  if (error.status === 400 || error.code === 'P2002') {
    return res.status(400).json({ error: "Bad Request", message: "Duplicate key violation. Check your input data." });
  }

  // For other errors, provide a generic message
  return res.status(500).json({ error: "Internal Server Error", message: "An unexpected error occurred on the server." });
};

const notFound = (req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
};

const errorHandler = {
  errorLogger,
  errorParser,
  notFound,
};

module.exports = errorHandler;