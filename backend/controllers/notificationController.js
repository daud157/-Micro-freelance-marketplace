import Notification from '../models/Notification.js';
import Application from '../models/Application.js';
import User from '../models/User.js';
import Project from '../models/Project.js';
import { Op } from 'sequelize';

// Get all notifications for the logged-in employer
export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      where: {
        employer_id: req.user.id
      },
      include: [
        {
          model: User,
          as: 'student',
          attributes: ['id', 'name', 'email']
        },
        {
          model: Project,
          as: 'project',
          attributes: ['id', 'title']
        },
        {
          model: Application,
          as: 'application',
          attributes: ['id', 'status']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Error fetching notifications' });
  }
};

// Mark a notification as read
export const markNotificationAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findOne({
      where: {
        id,
        employer_id: req.user.id
      }
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    await notification.update({ is_read: true });
    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ message: 'Error marking notification as read' });
  }
};

// Mark all notifications as read
export const markAllNotificationsAsRead = async (req, res) => {
  try {
    await Notification.update(
      { is_read: true },
      { 
        where: { 
          employer_id: req.user.id,
          is_read: false 
        }
      }
    );

    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({ message: 'Error updating notifications' });
  }
};

// Get unread notification count
export const getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.count({
      where: { 
        employer_id: req.user.id,
        is_read: false 
      }
    });

    res.json({ count });
  } catch (error) {
    console.error('Error getting unread count:', error);
    res.status(500).json({ message: 'Error getting unread count' });
  }
};

// Create a notification for a new application
export const createApplicationNotification = async (applicationId, projectId, studentId, employerId) => {
  try {
    const application = await Application.findByPk(applicationId, {
      include: [
        {
          model: User,
          as: 'student',
          attributes: ['name']
        },
        {
          model: Project,
          as: 'project',
          attributes: ['title']
        }
      ]
    });

    if (!application) {
      throw new Error('Application not found');
    }

    const message = `${application.student.name} has applied for your project "${application.project.title}"`;
    
    await Notification.create({
      type: 'application',
      message,
      employer_id: employerId,
      application_id: applicationId,
      project_id: projectId,
      student_id: studentId
    });
  } catch (error) {
    console.error('Error creating application notification:', error);
    throw error;
  }
};

// Create a notification for application status update
export const createStatusUpdateNotification = async (applicationId, status) => {
  try {
    const application = await Application.findByPk(applicationId, {
      include: [
        {
          model: User,
          as: 'student',
          attributes: ['name']
        },
        {
          model: Project,
          as: 'project',
          attributes: ['title']
        }
      ]
    });

    if (!application) {
      throw new Error('Application not found');
    }

    const message = `Your application for "${application.project.title}" has been ${status}`;
    
    await Notification.create({
      type: 'status_update',
      message,
      employer_id: application.project.employer_id,
      application_id: applicationId,
      project_id: application.project_id,
      student_id: application.student_id
    });
  } catch (error) {
    console.error('Error creating status update notification:', error);
    throw error;
  }
}; 