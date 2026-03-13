const express = require('express');
const { body, param } = require('express-validator');
const { validate } = require('../middleware/validate');

const {
  getAllProjects,
  getProjectById,
  createProject,
  deleteProject,
} = require('../controllers/projectController');

const {
  getTasksByProject,
  createTask,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');

const router = express.Router();

// Project validation rules
const projectValidationRules = [
  body('name').notEmpty().withMessage('Project name is required').trim(),
  body('description').optional().trim(),
];

// Task validation rules
const taskValidationRules = [
  body('title').notEmpty().withMessage('Task title is required').trim(),
  body('status').optional().isIn(['todo', 'in-progress', 'completed']).withMessage('Invalid status'),
  body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid priority'),
  body('due_date').optional().isISO8601().toDate().withMessage('Invalid date format'),
];

// Task Update validation rules - making title optional for partial updates
const taskUpdateValidationRules = [
  body('title').optional().notEmpty().withMessage('Task title cannot be empty').trim(),
  body('status').optional().isIn(['todo', 'in-progress', 'completed']).withMessage('Invalid status'),
  body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid priority'),
  body('due_date').optional().isISO8601().toDate().withMessage('Invalid date format'),
];

// Project Routes
router.route('/projects')
  .get(getAllProjects)
  .post(projectValidationRules, validate, createProject);

router.route('/projects/:id')
  .get(param('id').isMongoId().withMessage('Invalid project ID'), validate, getProjectById)
  .delete(param('id').isMongoId().withMessage('Invalid project ID'), validate, deleteProject);

// Task Routes nested under projects
router.route('/projects/:project_id/tasks')
  .get(param('project_id').isMongoId().withMessage('Invalid project ID'), validate, getTasksByProject)
  .post(
    param('project_id').isMongoId().withMessage('Invalid project ID'),
    taskValidationRules,
    validate,
    createTask
  );

// Individual Task Routes
router.route('/tasks/:id')
  .put(
    param('id').isMongoId().withMessage('Invalid task ID'),
    taskUpdateValidationRules,
    validate,
    updateTask
  )
  .delete(param('id').isMongoId().withMessage('Invalid task ID'), validate, deleteTask);

module.exports = router;
