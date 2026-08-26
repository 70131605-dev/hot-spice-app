import apiClient from "./client";

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export const registerUser = async (
  name: string,
  email: string,
  password: string,
  passwordConfirmation: string,
  phone: string,
): Promise<AuthResponse> => {
  const response = await apiClient.post("/register", {
    name,
    email,
    password,
    password_confirmation: passwordConfirmation,
    phone,
  });
  return response.data;
};

export const loginUser = async (
  email: string,
  password: string,
): Promise<AuthResponse> => {
  const response = await apiClient.post("/login", { email, password });
  return response.data;
};

export const logoutUser = async (): Promise<void> => {
  await apiClient.post("/logout");
};

export const updateProfile = async (
  name: string,
  email: string,
  phone: string,
): Promise<User> => {
  const response = await apiClient.put("/profile", { name, email, phone });
  return response.data.user;
};
