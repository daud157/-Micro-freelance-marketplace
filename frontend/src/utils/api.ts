import type { Student, Employer, Project, Application, Task, Submission, Feedback, StudentRegistration, EmployerRegistration } from '../types';
import axios from 'axios';

// Create axios instance with base URL
const axiosInstance = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add request interceptor to add auth token
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor to handle errors
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Handle unauthorized error (e.g., redirect to login)
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

const api = {
    // Auth endpoints
    login: async (data: { email: string; password: string }) => {
        const response = await axiosInstance.post('/auth/login', data);
        return response.data;
    },

    registerStudent: async (data: StudentRegistration) => {
        const response = await axiosInstance.post('/auth/register/student', data);
        return response.data;
    },

    registerEmployer: async (data: EmployerRegistration) => {
        const response = await axiosInstance.post('/auth/register/employer', data);
        return response.data;
    },

    // Students
    async getStudents() {
        const response = await axiosInstance.get('/students');
        return response.data;
    },

    // Employers
    async getEmployers() {
        const response = await axiosInstance.get('/employers');
        return response.data;
    },

    // Projects
    async getProjects() {
        const response = await axiosInstance.get('/projects');
        return response.data;
    },

    async getProject(id: string) {
        const response = await axiosInstance.get(`/projects/${id}`);
        return response.data;
    },

    async createProject(data: Omit<Project, 'project_id' | 'created_at' | 'updated_at'>) {
        const response = await axiosInstance.post('/projects', data);
        return response.data;
    },

    // Applications
    async getApplications() {
        const response = await axiosInstance.get('/applications');
        return response.data;
    },

    async createApplication(projectId: string, data: { cover_letter: string }) {
        const response = await axiosInstance.post(`/projects/${projectId}/apply`, data);
        return response.data;
    },

    // Tasks
    async getTasks() {
        const response = await axiosInstance.get('/tasks');
        return response.data;
    },

    async createTask(data: Omit<Task, 'task_id' | 'created_at'>) {
        const response = await axiosInstance.post('/tasks', data);
        return response.data;
    },

    // Submissions
    async getSubmissions() {
        const response = await axiosInstance.get('/submissions');
        return response.data;
    },

    async createSubmission(data: Omit<Submission, 'submission_id'>) {
        const response = await axiosInstance.post('/submissions', data);
        return response.data;
    },

    // Feedback
    async getFeedback() {
        const response = await axiosInstance.get('/feedback');
        return response.data;
    },

    async createFeedback(data: Omit<Feedback, 'feedback_id' | 'created_at'>) {
        const response = await axiosInstance.post('/feedback', data);
        return response.data;
    },
};

export { api }; 