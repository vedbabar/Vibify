import { axiosInstance } from '@/lib/axios';
import {create} from 'zustand';

interface AuthStore {
    isAdmin: boolean;
    isLoading: boolean;
    error: string | null;

    checkAdminStatus: () => Promise<void>;
    reset: () => void;
}

export const useAuthStore = create<AuthStore>((set) =>({
    isAdmin: false,
    isLoading: false,
    error: null,

    checkAdminStatus: async () => {
        try{
            set({ isLoading: true, error: null });
            const response = await axiosInstance.get('/admin/check');
            set({ isAdmin:  response.data.isAdmin});
        }catch(error: any) {
            set({isAdmin:false, error: error.response?.data?.message});
        }finally{
            set({ isLoading: false });
        }
    },

    reset: () => set({ isAdmin: false, isLoading: false, error: null }), 
}))