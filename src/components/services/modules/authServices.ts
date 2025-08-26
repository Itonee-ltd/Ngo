import apiClient from "../axiosInstance";

const login = async (payload: { email: string; password: string }) => {
  const { email, password } = payload;

  const response = await apiClient.post("/auth/login", {
    email,
    password,
  });

  return response;
};

const forgotPassword = async (payload: { email: string }) => {
  const response = await apiClient.post("/auth/forgot-password", payload);
  return response;
};


const createAccount = async (payload: {
  email: string;
  last_name: string;
  first_name: string;
  password: string;
}) => {
  const response = await apiClient.post('/auth/register', payload);

  return response;
};

const verifyEmail = async (payload: { token: string }) => {
  const response = await apiClient.post('/auth/verify-email', payload);

  return response;
};

const authService = {
  login,
  forgotPassword,
  verifyEmail,
  createAccount
};

export { authService };
