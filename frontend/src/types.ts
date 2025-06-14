export type UserRole = 'student' | 'employer';

export interface StudentRegistration {
    name: string;
    email: string;
    password: string;
    bio: string;
    skills: string[];
    role: 'student';
}

export interface EmployerRegistration {
    name: string;
    email: string;
    password: string;
    company_name: string;
    company_description: string;
    role: 'employer';
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    bio?: string;
    skills?: string[];
    company_name?: string;
    company_description?: string;
    created_at: string;
    updated_at: string;
}

export interface Student {
  student_id: string;
  name: string;
  email: string;
  bio: string;
  skills: string[];
}

export interface Employer {
  employer_id: string;
  name: string;
  email: string;
  company_name: string;
}

export interface Project {
    project_id: string;
    title: string;
    description: string;
    requirements: string;
    skills: string[];
    duration: string;
    status: 'open' | 'in_progress' | 'completed';
    employer_id: string;
    created_at: string;
    updated_at: string;
}

export interface Application {
    application_id: string;
    project_id: string;
    student_id: string;
    cover_letter: string;
    status: 'pending' | 'accepted' | 'rejected';
    created_at: string;
    updated_at: string;
}

export interface Task {
    task_id: string;
    project_id: string;
    title: string;
    description: string;
    due_date: string;
    status: 'pending' | 'in_progress' | 'completed';
    created_at: string;
}

export interface Submission {
    submission_id: string;
    task_id: string;
    student_id: string;
    content: string;
    status: 'pending' | 'approved' | 'rejected';
    created_at: string;
}

export interface Feedback {
    feedback_id: string;
    submission_id: string;
    employer_id: string;
    content: string;
    rating: number;
    created_at: string;
} 