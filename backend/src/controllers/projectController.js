const Project = require('../models/Project');
const Task = require('../models/Task');

// @desc    Get all projects with pagination
// @route   GET /projects API
exports.getAllProjects = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    const total = await Project.countDocuments();
    const projects = await Project.find().skip(startIndex).limit(limit).sort({ created_at: -1 });

    res.status(200).json({
      success: true,
      count: projects.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: projects,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single project
// @route   GET /projects/:id
exports.getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }
    res.status(200).json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new project
// @route   POST /projects
exports.createProject = async (req, res, next) => {
  try {
    const project = await Project.create(req.body);
    res.status(201).json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete project
// @route   DELETE /projects/:id
// Also removes all associated tasks
exports.deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }

    // Delete tasks associated with this project
    await Task.deleteMany({ project_id: req.params.id });
    
    // Use deleteOne instead of remove
    await project.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};
