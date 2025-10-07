// Fetch all members
export const getMembers = async () => {
  const token = localStorage.getItem('authToken');
  return api.get('/admin/members', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Fetch single member by ID
export const getMemberById = async (id) => {
  const token = localStorage.getItem('authToken');
  return api.get(`/admin/member/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
import axios from 'axios';

const BASE_URL = 'https://uniquefitness.onrender.com/api/v1';

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // if you need cookies for auth
});

// Change admin password
export const changeAdminPassword = async (oldPassword, newPassword) => {
  const token = localStorage.getItem('authToken');
  return api.patch('/admin/change-password', { oldPassword, newPassword }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Admin login (returns token and admin info)
export const adminLogin = async (email, password) => {
  return api.post('/admin/login', { email, password });
};

// Example: Add video for muscle group
export const addMuscleVideo = async (muscle, link) => {
  return api.post('/workout/video', { muscle, link });
};

// Example: Get videos for muscle group
export const getMuscleVideos = async (muscle) => {
  return api.get(`/workout/video/${muscle}`);
};

// Example: Remove video for muscle group
export const removeMuscleVideo = async (muscle, link) => {
  return api.delete('/workout/video', { data: { muscle, link } });
};

// Example: Update video for muscle group
export const updateMuscleVideo = async (muscle, oldLink, newLink) => {
  return api.put('/workout/video', { muscle, oldLink, newLink });
};

export default api;
