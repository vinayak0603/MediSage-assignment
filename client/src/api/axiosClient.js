import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'https://api-assignment-nu.vercel.app/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosClient;
