// API utility for Unique Fitness admin panel
import axios from 'axios';

const BASE_URL = 'https://uniquefitness.onrender.com/api/v1';

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // if you need cookies for auth
});

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
