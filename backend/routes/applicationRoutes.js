import express from 'express';
import { createApplication, getStudentApplications, getProjectApplications, updateApplicationStatus } from '../controllers/applicationController.js';
import { authenticateToken, authorizeRole } from '../middlewares/auth.js';

const router = express.Router();

// Student routes
router.post(
  '/',
  authenticateToken,
  authorizeRole('student'),
  createApplication
);

router.get(
  '/student',
  authenticateToken,
  authorizeRole('student'),
  getStudentApplications
);

// Employer routes
router.get(
  '/project/:project_id',
  authenticateToken,
  authorizeRole('employer'),
  getProjectApplications
);

router.patch(
  '/:application_id/status',
  authenticateToken,
  authorizeRole('employer'),
  updateApplicationStatus
);

export default router; 