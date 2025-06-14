import express from 'express';
import { getNotifications, markNotificationAsRead } from '../controllers/notificationController.js';
import { authenticateToken } from '../middlewares/auth.js';

const router = express.Router();

// Get all notifications for the logged-in employer
router.get('/', authenticateToken, getNotifications);

// Mark a notification as read
router.patch('/:id/read', authenticateToken, markNotificationAsRead);

export default router; 