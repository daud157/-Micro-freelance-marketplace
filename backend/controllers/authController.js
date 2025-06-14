import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// Ensure JWT_SECRET is set
const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_key_here_123';

// Get user profile
export const getProfile = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Return user data based on role
    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    if (user.role === 'student') {
      Object.assign(userData, {
        bio: user.bio,
        skills: user.skills
      });
    } else if (user.role === 'employer') {
      Object.assign(userData, {
        company_name: user.company_name,
        company_description: user.company_description
      });
    }

    res.json(userData);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Error fetching user profile' });
  }
};

// Register a new student
export const registerStudent = async (req, res) => {
  try {
    const { name, email, password, bio, skills } = req.body;
    console.log('Student registration request:', { name, email });

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      console.log('User already exists:', email);
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Create student user
    const userData = {
      name,
      email,
      password,
      role: 'student',
      bio,
      skills
    };

    console.log('Creating student user with data:', { ...userData, password: '[REDACTED]' });
    const user = await User.create(userData);
    console.log('Student user created successfully:', { id: user.id, email: user.email });

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'Student registered successfully',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        bio: user.bio,
        skills: user.skills
      }
    });
  } catch (error) {
    console.error('Student registration error:', error);
    res.status(500).json({ message: 'Error registering student', error: error.message });
  }
};

// Register a new employer
export const registerEmployer = async (req, res) => {
  try {
    const { name, email, password, company_name, company_description } = req.body;
    console.log('Employer registration request:', { name, email, company_name });

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      console.log('User already exists:', email);
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Create employer user
    const userData = {
      name,
      email,
      password,
      role: 'employer',
      company_name,
      company_description
    };

    console.log('Creating employer user with data:', { ...userData, password: '[REDACTED]' });
    const user = await User.create(userData);
    console.log('Employer user created successfully:', { id: user.id, email: user.email });

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'Employer registered successfully',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        company_name: user.company_name,
        company_description: user.company_description
      }
    });
  } catch (error) {
    console.error('Employer registration error:', error);
    res.status(500).json({ message: 'Error registering employer', error: error.message });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt for email:', email);

    // Find user by email using index
    // This query will use the email index we created
    const user = await User.findOne({
      where: { 
        email: email.toLowerCase() // Normalize email for consistent indexing
      },
      // Only select needed fields to reduce data transfer
      attributes: [
        'id', 
        'name', 
        'email', 
        'password', 
        'role',
        'bio',
        'skills',
        'company_name',
        'company_description'
      ]
    });

    if (!user) {
      console.log('User not found:', email);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    console.log('User found, checking password');

    // Check password
    const isPasswordValid = await user.checkPassword(password);
    if (!isPasswordValid) {
      console.log('Invalid password for user:', email);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    console.log('Password valid, generating token');

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('Login successful for user:', { 
      id: user.id, 
      email: user.email, 
      role: user.role 
    });

    // Return user data based on role
    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    if (user.role === 'student') {
      Object.assign(userData, {
        bio: user.bio,
        skills: user.skills
      });
    } else if (user.role === 'employer') {
      Object.assign(userData, {
        company_name: user.company_name,
        company_description: user.company_description
      });
    }

    res.json({
      message: 'Login successful',
      token,
      user: userData
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
}; 