import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';
import Project from './Project.js';

const Application = sequelize.define('Application', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  project_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'projects',
      key: 'id'
    },
    index: true // Index for foreign key
  },
  student_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    index: true // Index for foreign key
  },
  cover_letter: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      len: [50, 2000] // Cover letter must be between 50 and 2000 characters
    }
  },
  status: {
    type: DataTypes.ENUM('pending', 'accepted', 'rejected'),
    defaultValue: 'pending',
    allowNull: false,
    index: true // Index for status-based queries
  },
  feedback: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    index: true // Index for date-based queries
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  timestamps: true,
  underscored: true,
  indexes: [
    // Unique constraint for project_id and student_id
    {
      unique: true,
      fields: ['project_id', 'student_id'],
      name: 'application_unique_project_student'
    },
    // Composite index for status and created_at
    {
      name: 'application_status_created_idx',
      fields: ['status', 'created_at']
    },
    // Composite index for student_id and status
    {
      name: 'application_student_status_idx',
      fields: ['student_id', 'status']
    },
    // Composite index for project_id and status
    {
      name: 'application_project_status_idx',
      fields: ['project_id', 'status']
    }
  ]
});

// Define associations
Application.belongsTo(User, {
  foreignKey: 'student_id',
  as: 'student'
});

Application.belongsTo(Project, {
  foreignKey: 'project_id',
  as: 'project'
});

export default Application; 