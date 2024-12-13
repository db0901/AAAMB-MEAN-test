const Task = require("../models/task.model");
const { ApiError } = require("../middleware/error.middleware");
const asyncHandler = require("express-async-handler");

// Get all tasks with optional filters
const getTasks = asyncHandler(async (req, res) => {
  const { status, priority, tags, startDate, endDate } = req.query;
  const filter = {};

  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (tags) filter.tags = { $in: tags.split(",") };
  if (startDate || endDate) {
    filter.dueDate = {};
    if (startDate) filter.dueDate.$gte = new Date(startDate);
    if (endDate) filter.dueDate.$lte = new Date(endDate);
  }

  const tasks = await Task.find(filter).sort({ dueDate: 1 });
  res.json(tasks);
});

// Get single task by ID
const getTaskById = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) {
    throw new ApiError(404, "Task not found");
  }
  res.json(task);
});

const createTask = asyncHandler(async (req, res) => {
  const task = await Task.create(req.body);
  res.status(201).json(task);
});

// Update task
const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  console.log(task.status, req.body.status);
  // Prevent changing status directly from Pending to Completed
  if (task.status === "Pending" && req.body.status === "Completed") {
    throw new ApiError(
      400,
      "Cannot change status directly from Pending to Completed"
    );
  }

  // Create history entry for changes
  const changes = [];
  for (const [key, value] of Object.entries(req.body)) {
    if (task[key] !== value) {
      changes.push({
        field: key,
        oldValue: task[key],
        newValue: value,
      });
    }
  }

  if (changes.length > 0) {
    req.body.history = [...(task.history || []), ...changes];
  }

  const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.json(updatedTask);
});

// Delete task
const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findByIdAndDelete(req.params.id);

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  res.status(204).send();
});

module.exports = { getTasks, getTaskById, createTask, updateTask, deleteTask };
