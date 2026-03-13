const Task = require('../models/Task');
const Project = require('../models/Project');

// @desc    Get tasks for a specific project
// @route   GET /projects/:project_id/tasks
// @query   status, sortBy
exports.getTasksByProject = async (req, res, next) => {
  try {
    const { project_id } = req.params;
    const { status, sortBy } = req.query;

    const query = { project_id };
    
    // Filtering by status
    if (status) {
      query.status = status;
    }

    // Sorting by due_date
    let sortObj = { created_at: -1 };
    if (sortBy === 'due_date') {
      sortObj = { due_date: 1 };
    } else if (sortBy === '-due_date') {
      sortObj = { due_date: -1 };
    }

    const tasks = await Task.find(query).sort(sortObj);

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add task to project
// @route   POST /projects/:project_id/tasks
exports.createTask = async (req, res, next) => {
  try {
    req.body.project_id = req.params.project_id;

    const project = await Project.findById(req.params.project_id);
    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }

    const task = await Task.create(req.body);
    res.status(201).json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

// @desc    Update task
// @route   PUT /tasks/:id
exports.updateTask = async (req, res, next) => {
  try {
    // Exclude fields we don't want to update directly
    const updateData = { ...req.body };
    delete updateData.project_id;
    delete updateData.id;

    const task = await Task.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }

    res.status(200).json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete task
// @route   DELETE /tasks/:id
exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }

    await task.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};
