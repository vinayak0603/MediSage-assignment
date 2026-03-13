import axiosClient from './axiosClient';

export const projectApi = {
  getProjects: async (page = 1, limit = 10) => {
    const response = await axiosClient.get(`/projects?page=${page}&limit=${limit}`);
    return response.data;
  },
  
  getProject: async (id) => {
    const response = await axiosClient.get(`/projects/${id}`);
    return response.data;
  },

  createProject: async (data) => {
    const response = await axiosClient.post('/projects', data);
    return response.data;
  },

  deleteProject: async (id) => {
    const response = await axiosClient.delete(`/projects/${id}`);
    return response.data;
  }
};
