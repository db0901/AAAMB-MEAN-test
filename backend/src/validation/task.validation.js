const Joi = require("joi");

const createTaskSchema = Joi.object({
  title: Joi.string().min(3).required(),
  description: Joi.string().max(500).optional(),
  status: Joi.string().valid("Pending", "In Progress", "Completed").required(),
  priority: Joi.string().valid("Low", "Medium", "High").default("Medium"),
  dueDate: Joi.date().greater("now").required(),
  tags: Joi.array().items(Joi.string().trim()).unique(),
});

const updateTaskSchema = Joi.object({
  title: Joi.string().min(3),
  description: Joi.string().max(500),
  status: Joi.string().valid("Pending", "In Progress", "Completed"),
  priority: Joi.string().valid("Low", "Medium", "High"),
  dueDate: Joi.date().greater("now"),
  tags: Joi.array().items(Joi.string().trim()).unique(),
}).min(1); // At least one field should be present for update

module.exports = { createTaskSchema, updateTaskSchema };
