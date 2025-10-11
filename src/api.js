// Update membership plan by ID
export const updateMembershipPlan = async (id, planData) => {
  const token = localStorage.getItem('authToken');
  return api.patch(`/membership/${id}`, planData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
// Delete membership plan by ID
export const deleteMembershipPlan = async (id) => {
  const token = localStorage.getItem('authToken');
  return api.delete(`/membership/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
// Create membership plan
export const createMembershipPlan = async (planData) => {
  const token = localStorage.getItem('authToken');
  return api.post('/membership', planData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
// Get membership plans
export const getMembershipPlans = async () => {
  const token = localStorage.getItem('authToken');
  return api.get('/membership', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
// Delete announcement by ID
export const deleteAnnouncement = async (id) => {
  const token = localStorage.getItem('authToken');
  return api.delete(`/announcement/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
// Update announcement by ID
export const updateAnnouncement = async (id, title, content) => {
  const token = localStorage.getItem('authToken');
  return api.patch(`/announcement/${id}`, { title, content }, {
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
export const addWorkoutVideos = async (muscle, videos) => {
  const token = localStorage.getItem('authToken');
  return api.post('/workout/video', { muscle, videos }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Get videos for muscle group
export const getMuscleVideos = async (muscle) => {
  const token = localStorage.getItem('authToken');
  return api.get(`/workout/video?muscle=${encodeURIComponent(muscle)}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Remove video for muscle group
export const removeMuscleVideo = async (muscle, video) => {
  const token = localStorage.getItem('authToken');
  return api.delete('/workout/video', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: { muscle, video },
  });
};

// Example: Update video for muscle group
export const updateMuscleVideo = async (muscle, oldLink, newLink) => {
  return api.put('/workout/video', { muscle, oldLink, newLink });
};

// Dashboard stats
export const getDashboardStats = async () => {
  const token = localStorage.getItem('authToken');
  return api.get('/admin/dashboard-stats', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export default api;

// Delete diet plan by ID
export const deleteDietPlan = async (id) => {
  const token = localStorage.getItem('authToken');
  return api.delete(`/admin/dietplan/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Admin: Create diet plan (supports multiple payload shapes)
export const createDietPlanAdmin = async (payload) => {
  const token = localStorage.getItem('authToken');
  return api.post('/admin/dietplan', payload, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
};
