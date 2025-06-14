import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';

const Project = sequelize.define('Project', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    index: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  requirements: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  skills: {
    type: DataTypes.TEXT,
    allowNull: false,
    get() {
      const rawValue = this.getDataValue('skills');
      return rawValue ? JSON.parse(rawValue) : [];
    },
    set(value) {
      this.setDataValue('skills', JSON.stringify(value));
    }
  },
  duration: {
    type: DataTypes.STRING,
    allowNull: false,
    index: true
  },
  status: {
    type: DataTypes.ENUM('open', 'in_progress', 'completed'),
    defaultValue: 'open',
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
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    index: true
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  timestamps: true,
  underscored: true,
  indexes: [
    {
      name: 'status_created_idx',
      fields: ['status', 'created_at']
    },
    {
      name: 'project_search_idx',
      fields: ['title', 'description', 'requirements'],
      type: 'FULLTEXT'
    },
    {
      name: 'employer_status_idx',
      fields: ['employer_id', 'status']
    }
  ]
});

// Define associations
Project.belongsTo(User, { foreignKey: 'employer_id', as: 'employer' });

export default Project; 