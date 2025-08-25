import axios from "axios";

const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api/v1/auth',
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const savedToken: string | null = localStorage.getItem(
      "token"
    );
    const parsedToken: string | null = savedToken ? savedToken : null;
    if (parsedToken) {
      config.headers.Authorization = `Bearer ${parsedToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.log(error);
    return Promise.reject(error);
  }
);

export default apiClient;
