require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/database");
const taskRoutes = require("./routes/task.routes");
const { errorMiddleware } = require("./middleware/error.middleware");
const requestLogger = require("./middleware/request.middleware");
const logger = require("./config/logger");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use(requestLogger);
app.use("/api/tasks", taskRoutes);

app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});
