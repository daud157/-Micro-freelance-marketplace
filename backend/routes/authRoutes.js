import express from 'express';
import { login, registerStudent, registerEmployer, getProfile } from '../controllers/authController.js';
import { validateStudentRegistration, validateEmployerRegistration, validateLogin } from '../middlewares/validation.js';
import { authenticateToken } from '../middlewares/auth.js';

const router = express.Router();

// Auth routes
router.post('/login', validateLogin, login);
router.post('/register/student', validateStudentRegistration, registerStudent);
router.post('/register/employer', validateEmployerRegistration, registerEmployer);
router.get('/profile', authenticateToken, getProfile);

export default router; 