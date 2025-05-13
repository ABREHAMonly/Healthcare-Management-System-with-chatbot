import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:5000/api', // Ensure this matches your server's base URL
});

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

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
            if (error.response.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('profile');
                window.location.href = '/login';
            } else if (error.response.status === 500) {
                console.error('Server error:', error.response.data.message);
            } else if (error.response.status === 403) {
                console.error('Forbidden: You do not have permission to access this resource.');
            } else {
                console.error('Error in response interceptor:', error.response.data.message || error.message);
            }
        } else {
            console.error('Error in response interceptor:', error.message);
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
