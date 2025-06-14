import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor to include the auth token
api.interceptors.request.use(
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

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const apiService = {
  // Auth
  login: (data: { email: string; password: string }) => api.post('/auth/login', data),
  registerStudent: (data: any) => api.post('/auth/register/student', data),
  registerEmployer: (data: any) => api.post('/auth/register/employer', data),

  // Projects
  getProjects: () => api.get('/projects'),
  getProject: (id: number) => api.get(`/projects/${id}`),
  createProject: (data: any) => api.post('/projects', data),
  updateProjectStatus: (id: number, status: string) => api.patch(`/projects/${id}/status`, { status }),
  applyToProject: (projectId: number, data: { cover_letter: string }) => api.post(`/projects/${projectId}/apply`, data),

  // Applications
  getStudentApplications: () => api.get('/applications/student'),
  getProjectApplications: (projectId: number) => api.get(`/applications/project/${projectId}`),
  updateApplicationStatus: (applicationId: number, status: string) => api.patch(`/applications/${applicationId}/status`, { status }),

  // Notifications
  getNotifications: () => api.get('/notifications'),
  markNotificationAsRead: (notificationId: number) => api.patch(`/notifications/${notificationId}/read`),
  markAllNotificationsAsRead: () => api.patch('/notifications/read-all'),
};

export default apiService; 