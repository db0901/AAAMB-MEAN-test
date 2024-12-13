const express = require("express");
const router = express.Router();
const taskController = require("../controllers/task.controller");
const validate = require("../middleware/validate.middleware");
const {
  createTaskSchema,
  updateTaskSchema,
} = require("../validation/task.validation");

// GET /api/tasks - Get all tasks (with optional filters)
router.get("/", taskController.getTasks);

// GET /api/tasks/:id - Get single task
router.get("/:id", taskController.getTaskById);

// POST /api/tasks - Create new task
router.post("/", validate(createTaskSchema), taskController.createTask);

// PUT /api/tasks/:id - Update task
router.put("/:id", validate(updateTaskSchema), taskController.updateTask);

// DELETE /api/tasks/:id - Delete task
router.delete("/:id", taskController.deleteTask);

module.exports = router;
