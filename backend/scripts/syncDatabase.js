import sequelize from '../config/database.js';
import User from '../models/User.js';
import Project from '../models/Project.js';
import Application from '../models/Application.js';
import Notification from '../models/Notification.js';

const syncDatabase = async () => {
  try {
    // Disable foreign key checks temporarily
    await sequelize.query('PRAGMA foreign_keys = OFF;');

    // Drop all tables in the correct order
    await sequelize.query('DROP TABLE IF EXISTS notifications;');
    await sequelize.query('DROP TABLE IF EXISTS applications;');
    await sequelize.query('DROP TABLE IF EXISTS projects;');
    await sequelize.query('DROP TABLE IF EXISTS users;');

    // Re-enable foreign key checks
    await sequelize.query('PRAGMA foreign_keys = ON;');

    // Sync all models in the correct order
    await User.sync({ force: true });
    await Project.sync({ force: true });
    await Application.sync({ force: true });
    await Notification.sync({ force: true });

    console.log('Database synchronized successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error synchronizing database:', error);
    process.exit(1);
  }
};

syncDatabase(); 