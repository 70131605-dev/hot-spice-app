import apiClient from "./client";

export interface Category {
  id: number;
  name: string;
  slug: string;
  sort_order: number;
}

export interface MenuItem {
  id: number;
  category_id: number;
  name: string;
  slug: string;
  description: string | null;
  price: string;
  image: string | null;
  calories: number | null;
  is_featured: boolean;
  category: Category;
}

export const getCategories = async (): Promise<Category[]> => {
  const response = await apiClient.get("/categories");
  return response.data;
};

export const getMenuItems = async (
  categoryId?: number,
): Promise<MenuItem[]> => {
  const params = categoryId ? { category_id: categoryId } : {};
  const response = await apiClient.get("/menu-items", { params });
  return response.data;
};
