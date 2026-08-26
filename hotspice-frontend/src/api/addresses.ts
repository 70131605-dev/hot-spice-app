import apiClient from "./client";

export interface Address {
  id: number;
  label: string;
  address_line: string;
  city: string | null;
  latitude: number | null;
  longitude: number | null;
  is_default: boolean;
}

export const getAddresses = async (): Promise<Address[]> => {
  const response = await apiClient.get("/addresses");
  return response.data;
};

export const createAddress = async (data: {
  label: string;
  address_line: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  is_default?: boolean;
}): Promise<Address> => {
  const response = await apiClient.post("/addresses", data);
  return response.data;
};

export const deleteAddress = async (id: number): Promise<void> => {
  await apiClient.delete(`/addresses/${id}`);
};

export const setDefaultAddress = async (id: number): Promise<Address> => {
  const response = await apiClient.post(`/addresses/${id}/default`);
  return response.data;
};
