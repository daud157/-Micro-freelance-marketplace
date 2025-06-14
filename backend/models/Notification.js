import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';
import Project from './Project.js';
import Application from './Application.js';

const Notification = sequelize.define('Notification', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  type: {
    type: DataTypes.ENUM('application', 'status_update'),
    allowNull: false,
    index: true
  },
  message: {
    type: DataTypes.STRING,
    allowNull: false
  },
  is_read: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    index: true
  },
  employer_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    },
    index: true
  },
  application_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'Applications',
      key: 'id'
    },
    index: true
  },
  project_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'Projects',
      key: 'id'
    },
    index: true
  },
  student_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'Users',
      key: 'id'
    },
    index: true
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    index: true
  }
}, {
  timestamps: true,
  underscored: true,
  indexes: [
    {
      name: 'notification_employer_read_idx',
      fields: ['employer_id', 'is_read']
    },
    {
      name: 'notification_student_read_idx',
      fields: ['student_id', 'is_read']
    },
    {
      name: 'notification_type_created_idx',
      fields: ['type', 'created_at']
    }
  ]
});

// Define associations
Notification.belongsTo(User, { as: 'employer', foreignKey: 'employer_id' });
Notification.belongsTo(User, { as: 'student', foreignKey: 'student_id' });
Notification.belongsTo(Project, { as: 'project', foreignKey: 'project_id' });
Notification.belongsTo(Application, { as: 'application', foreignKey: 'application_id' });

export default Notification; 