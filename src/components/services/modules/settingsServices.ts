import apiClient from "../axiosInstance";

const getProfile = async () => {
  const response = await apiClient.get("/profile");
  return response;
};

const updateProfile = async (payload: any) => {
  const response = await apiClient.patch("/profile", payload);
  return response;
};

const updatePassword = async (payload: {
  old_password: string;
  new_password: string;
}) => {
  const response = await apiClient.put("/change-password", payload);

  return response;
};


const settingsServices = {
  updateProfile,
  updatePassword,
  getProfile,
};

export { settingsServices };
