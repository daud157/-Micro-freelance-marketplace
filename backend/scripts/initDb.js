import sequelize from '../config/database.js';
import User from '../models/User.js';

const initDatabase = async () => {
  try {
    // Drop all tables and recreate them
    await sequelize.sync({ force: true });
    console.log('Database synchronized successfully');

    // Create test employer
    const employer = await User.create({
      name: 'Test Employer',
      email: 'employer@test.com',
      password: 'Test123!',
      role: 'employer',
      company_name: 'Test Company',
      company_description: 'A test company for development'
    });

    // Create test student
    const student = await User.create({
      name: 'Test Student',
      email: 'student@test.com',
      password: 'Test123!',
      role: 'student',
      bio: 'A test student for development',
      skills: ['SQL', 'Python', 'Data Analysis']
    });

    console.log('Test users created successfully');

    // Verify the users were created correctly
    const users = await User.findAll();
    console.log('Created users:', users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    })));

  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
};

// Run the initialization
initDatabase(); 