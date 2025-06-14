import express from 'express';
import cors from 'cors';
import sequelize from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import dotenv from 'dotenv';

// Import models to ensure they are registered with Sequelize
import './models/User.js';
import './models/Project.js';
import './models/Application.js';
import './models/Notification.js';

// Load environment variables first
dotenv.config();

// Ensure JWT_SECRET is set
if (!process.env.JWT_SECRET) {
  console.warn('Warning: JWT_SECRET is not set in environment variables. Using default secret.');
  process.env.JWT_SECRET = 'your_super_secret_key_here_123';
}

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/notifications', notificationRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

// Initialize database and start server
const startServer = async () => {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');

    // Sync all models with the database
    // Use alter: true to update tables without dropping them
    await sequelize.sync({ alter: true });
    console.log('Database tables have been synchronized successfully.');

    // Start server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
};

startServer();
