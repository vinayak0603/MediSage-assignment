import axiosClient from './axiosClient';

export const taskApi = {
  getTasks: async (projectId, filters = {}) => {
    const { status, sortBy } = filters;
    let url = `/projects/${projectId}/tasks?`;
    if (status) url += `status=${status}&`;
    if (sortBy) url += `sortBy=${sortBy}&`;
    
    const response = await axiosClient.get(url);
    return response.data;
  },

  createTask: async (projectId, data) => {
    const response = await axiosClient.post(`/projects/${projectId}/tasks`, data);
    return response.data;
  },

  updateTask: async (id, data) => {
    const response = await axiosClient.put(`/tasks/${id}`, data);
    return response.data;
  },

  deleteTask: async (id) => {
    const response = await axiosClient.delete(`/tasks/${id}`);
    return response.data;
  }
};
