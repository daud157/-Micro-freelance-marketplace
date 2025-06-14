import Application from '../models/Application.js';
import Project from '../models/Project.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';
import { Op } from 'sequelize';
import { createApplicationNotification, createStatusUpdateNotification } from './notificationController.js';

// Create a new application
export const createApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const { cover_letter } = req.body;
    const student_id = req.user.id;

    // Validate project exists and is open
    const project = await Project.findByPk(id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    if (project.status !== 'open') {
      return res.status(400).json({ message: 'This project is not accepting applications' });
    }

    // Check if student has already applied
    const existingApplication = await Application.findOne({
      where: {
        project_id: id,
        student_id
      }
    });

    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied for this project' });
    }

    // Create application
    const application = await Application.create({
      project_id: id,
      student_id,
      cover_letter
    });

    // Create notification for employer
    await createApplicationNotification(application.id, id, student_id, project.employer_id);

    // Return application with student and project details
    const fullApplication = await Application.findByPk(application.id, {
      include: [
        {
          model: User,
          as: 'student',
          attributes: ['id', 'name', 'email', 'bio', 'skills']
        },
        {
          model: Project,
          as: 'project',
          attributes: ['id', 'title', 'description', 'requirements', 'skills', 'duration']
        }
      ]
    });

    res.status(201).json({
      message: 'Application submitted successfully',
      application: fullApplication
    });
  } catch (error) {
    console.error('Application creation error:', error);
    res.status(500).json({ message: 'Error creating application', error: error.message });
  }
};

// Get all applications for a student
export const getStudentApplications = async (req, res) => {
  try {
    const student_id = req.user.id;

    const applications = await Application.findAll({
      where: { student_id },
      include: [
        {
          model: Project,
          as: 'project',
          attributes: ['id', 'title', 'description', 'requirements', 'skills', 'duration', 'status']
        }
      ],
      order: [['created_at', 'DESC']]
    });

    res.json(applications);
  } catch (error) {
    console.error('Error fetching student applications:', error);
    res.status(500).json({ message: 'Error fetching applications', error: error.message });
  }
};

// Get all applications for a project (employer only)
export const getProjectApplications = async (req, res) => {
  try {
    const { project_id } = req.params;
    const employer_id = req.user.id;

    // Verify project belongs to employer
    const project = await Project.findOne({
      where: {
        id: project_id,
        employer_id
      }
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found or unauthorized' });
    }

    const applications = await Application.findAll({
      where: { project_id },
      include: [
        {
          model: User,
          as: 'student',
          attributes: ['id', 'name', 'email', 'bio', 'skills']
        }
      ],
      order: [['created_at', 'DESC']]
    });

    res.json(applications);
  } catch (error) {
    console.error('Error fetching project applications:', error);
    res.status(500).json({ message: 'Error fetching applications', error: error.message });
  }
};

// Update application status (employer only)
export const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const application = await Application.findByPk(id, {
      include: [
        {
          model: Project,
          as: 'project',
          attributes: ['employer_id']
        }
      ]
    });

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Verify the employer owns the project
    if (application.project.employer_id !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this application' });
    }

    await application.update({ status });

    // Create notification for student
    await createStatusUpdateNotification(id, status);

    res.json({
      message: 'Application status updated successfully',
      application
    });
  } catch (error) {
    console.error('Application status update error:', error);
    res.status(500).json({ message: 'Error updating application status', error: error.message });
  }
}; 