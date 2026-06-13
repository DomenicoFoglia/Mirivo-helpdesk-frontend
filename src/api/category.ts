import api from "./axios"
import type { Category } from "../types"

export const categoryListApi = async () => {
    const res = await  api.get<Category[]>('/admin/categories');
    return res.data;
}

export const createCategoryApi = async (name: string) => {
    const res = await api.post<Category>(`/admin/categories`, { name });
    return res.data;
}

export const updateCategoryApi = async (id: number, name: string) => {
    const res = await api.put<Category>(`/admin/categories/${id}`, {name});
    return res.data;
}

export const deleteCategoryApi = async (id: number) =>{
    return api.delete(`/admin/categories/${id}`);
}