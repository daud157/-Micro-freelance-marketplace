import express from 'express';
import { createProject, getProjects, getProjectById, updateProjectStatus } from '../controllers/projectController.js';
import { validateProject } from '../middlewares/validation.js';
import { authenticateToken, authorizeRole } from '../middlewares/auth.js';
import { createApplication } from '../controllers/applicationController.js';

const router = express.Router();

// Public routes
router.get('/', getProjects);
router.get('/:id', getProjectById);

// Protected routes (require authentication)
router.post('/', authenticateToken, authorizeRole('employer'), validateProject, createProject);
router.patch('/:id/status', authenticateToken, authorizeRole('employer'), updateProjectStatus);

// Application route (students only)
router.post(
  '/:id/apply',
  authenticateToken,
  authorizeRole('student'),
  createApplication
);

export default router; 