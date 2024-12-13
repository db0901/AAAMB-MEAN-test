const mongoose = require("mongoose");

const taskHistorySchema = new mongoose.Schema({
  field: String,
  oldValue: mongoose.Schema.Types.Mixed,
  newValue: mongoose.Schema.Types.Mixed,
  changedAt: { type: Date, default: Date.now },
});

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: 3,
    },
    description: {
      type: String,
      maxlength: 500,
    },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed"],
      required: true,
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    dueDate: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          return value > new Date();
        },
        message: "Due date must be in the future",
      },
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    history: [taskHistorySchema],
  },
  {
    timestamps: true,
  }
);

// Indexes for optimized querying
taskSchema.index({ dueDate: 1 });
taskSchema.index({ status: 1 });

// Ensure tags are unique within a task
taskSchema.pre("save", function (next) {
  if (this.tags) {
    this.tags = [...new Set(this.tags)];
  }
  next();
});

module.exports = mongoose.model("Task", taskSchema);
