import axios from "axios";
import type {
  Address,
  Category,
  CreateOrderPayload,
  MenuItem,
  Order,
  User,
} from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

export const apiClient = axios.create({
  baseURL: API_URL,
});

apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = window.localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

type UnauthorizedHandler = () => void;
let unauthorizedHandler: UnauthorizedHandler | null = null;

export function registerUnauthorizedHandler(handler: UnauthorizedHandler) {
  unauthorizedHandler = handler;
}

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      unauthorizedHandler?.();
    }
    return Promise.reject(error);
  }
);

export function getErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message;
    if (typeof message === "string") return message;
  }
  return fallback;
}

export interface FieldErrors {
  [field: string]: string[];
}

export function getFieldErrors(error: unknown): FieldErrors | null {
  if (axios.isAxiosError(error) && error.response?.status === 422) {
    const errors = error.response?.data?.errors;
    if (errors && typeof errors === "object") return errors as FieldErrors;
  }
  return null;
}

// Auth
export async function loginRequest(email: string, password: string) {
  const { data } = await apiClient.post<{ user: User; token: string }>(
    "/login",
    { email, password }
  );
  return data;
}

export async function registerRequest(
  name: string,
  email: string,
  password: string,
  password_confirmation: string,
  phone: string
) {
  const { data } = await apiClient.post<{ user: User; token: string }>(
    "/register",
    { name, email, password, password_confirmation, phone }
  );
  return data;
}

export async function logoutRequest() {
  await apiClient.post("/logout");
}

// Categories
export async function fetchCategories() {
  const { data } = await apiClient.get<Category[]>("/categories");
  return data;
}

// Menu items
export async function fetchMenuItems(categoryId?: number) {
  const { data } = await apiClient.get<MenuItem[]>("/menu-items", {
    params: categoryId ? { category_id: categoryId } : undefined,
  });
  return data;
}

// Addresses
export async function fetchAddresses() {
  const { data } = await apiClient.get<Address[]>("/addresses");
  return data;
}

export async function createAddress(payload: {
  label: string;
  address_line: string;
  city?: string;
  is_default?: boolean;
}) {
  const { data } = await apiClient.post<Address>("/addresses", payload);
  return data;
}

export async function deleteAddress(id: number) {
  await apiClient.delete(`/addresses/${id}`);
}

export async function setDefaultAddress(id: number) {
  const { data } = await apiClient.post<Address>(`/addresses/${id}/default`);
  return data;
}

// Orders
export async function createOrder(payload: CreateOrderPayload) {
  const { data } = await apiClient.post<Order>("/orders", payload);
  return data;
}

export async function fetchOrders() {
  const { data } = await apiClient.get<Order[]>("/orders");
  return data;
}
