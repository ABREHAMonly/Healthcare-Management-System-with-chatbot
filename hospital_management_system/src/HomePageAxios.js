// HomePageAxios.js
import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:5000/api', // Ensure this matches your server's base URL
});

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            console.error('Error in response interceptor:', error.response.data.message || error.message);
        } else {
            console.error('Error in response interceptor:', error.message);
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
