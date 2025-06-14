import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const submitApplication = async (projectId: string, coverLetter: string) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/projects/${projectId}/apply`,
      { cover_letter: coverLetter },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to submit application');
    }
    throw error;
  }
};

export const getStudentApplications = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/applications/student`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to fetch applications');
    }
    throw error;
  }
};

export const getEmployerApplications = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/applications/employer`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to fetch applications');
    }
    throw error;
  }
}; 