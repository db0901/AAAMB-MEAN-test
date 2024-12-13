const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });
const mongoose = require("mongoose");
const Task = require("../models/task.model");
const logger = require("../config/logger");

const seedData = [
  {
    title: "Complete Project Documentation",
    description: "Write comprehensive documentation for the MEAN stack project",
    status: "Pending",
    priority: "High",
    dueDate: new Date("2024-12-31"),
    tags: ["documentation", "urgent"],
  },
  {
    title: "Setup CI/CD Pipeline",
    description:
      "Configure GitHub Actions for automated testing and deployment",
    status: "In Progress",
    priority: "Medium",
    dueDate: new Date("2024-12-25"),
    tags: ["devops", "infrastructure"],
  },
  {
    title: "Review Pull Requests",
    description: "Review and merge pending pull requests from the team",
    status: "In Progress",
    priority: "High",
    dueDate: new Date("2024-12-20"),
    tags: ["code-review", "team"],
  },
  {
    title: "Update Dependencies",
    description: "Update all npm packages to their latest stable versions",
    status: "Pending",
    priority: "Low",
    dueDate: new Date("2024-12-28"),
    tags: ["maintenance", "dependencies"],
  },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    logger.info("Connected to MongoDB");

    // Clear existing tasks
    await Task.deleteMany({});
    logger.info("Cleared existing tasks");

    // Insert new tasks
    const tasks = await Task.insertMany(seedData);
    logger.info(`Seeded ${tasks.length} tasks successfully`);

    await mongoose.disconnect();
    logger.info("Disconnected from MongoDB");
    process.exit(0);
  } catch (error) {
    logger.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
