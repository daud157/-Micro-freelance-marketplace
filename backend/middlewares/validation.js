import { body, validationResult } from 'express-validator';

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Student registration validation
export const validateStudentRegistration = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/[a-z]/)
    .withMessage('Password must contain at least one lowercase letter')
    .matches(/[0-9]/)
    .withMessage('Password must contain at least one number'),
  body('bio')
    .notEmpty()
    .withMessage('Bio is required for students'),
  body('skills')
    .notEmpty()
    .withMessage('Skills are required for students'),
  validate
];

// Employer registration validation
export const validateEmployerRegistration = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/[a-z]/)
    .withMessage('Password must contain at least one lowercase letter')
    .matches(/[0-9]/)
    .withMessage('Password must contain at least one number'),
  body('company_name')
    .notEmpty()
    .withMessage('Company name is required for employers'),
  body('company_description')
    .notEmpty()
    .withMessage('Company description is required for employers'),
  validate
];

// Login validation
export const validateLogin = [
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
  validate
];

// Project validation
export const validateProject = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Project title is required')
    .isLength({ min: 5, max: 100 })
    .withMessage('Title must be between 5 and 100 characters'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Project description is required')
    .isLength({ min: 50 })
    .withMessage('Description must be at least 50 characters long'),
  body('requirements')
    .trim()
    .notEmpty()
    .withMessage('Project requirements are required')
    .isLength({ min: 30 })
    .withMessage('Requirements must be at least 30 characters long'),
  body('skills')
    .isArray()
    .withMessage('Skills must be an array')
    .notEmpty()
    .withMessage('At least one skill is required'),
  body('duration')
    .trim()
    .notEmpty()
    .withMessage('Project duration is required')
    .matches(/^[0-9]+ (week|month|year)s?$/)
    .withMessage('Duration must be in format: "X week(s)", "X month(s)", or "X year(s)"'),
  validate
]; 