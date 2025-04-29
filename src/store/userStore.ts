import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

export interface User {
  id: string;
  gender: string;
  name: {
    title: string;
    first: string;
    last: string;
  };
  location: {
    street: {
      number: number;
      name: string;
    };
    city: string;
    state: string;
    country: string;
  };
  email: string;
  phone: string;
  picture: {
    large: string;
    medium: string;
    thumbnail: string;
  };
  dob: {
    date: string;
    age: number;
  };
}

interface UserState {
  users: User[];
  savedUsers: User[];
  loading: boolean;
  error: string | null;
  fetchRandomUsers: (force?: boolean) => Promise<void>;
  fetchSavedUsers: () => Promise<void>;
  fetchUserById: (id: string) => Promise<User | null>;
  saveUser: (user: User) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  updateUser: (id: string, user: Partial<User>) => Promise<void>;
  updateRandomUserName: (id: string, name: { title: string; first: string; last: string }) => void;
}

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      users: [],
      savedUsers: [],
      loading: false,
      error: null,

      fetchRandomUsers: async (force = false) => {
        const currentUsers = get().users;
        console.log('Current users:', currentUsers.length, 'Force:', force);

        if (currentUsers.length > 0 && !force) {
          console.log('Returning existing users');
          return;
        }

        console.log('Fetching new users');
        set({ loading: true, error: null });
        try {
          const response = await axios.get(`${backendUrl ?? 'http://localhost:5001'}/api/random-users`);
          const users = response.data.map((user: any) => ({
            ...user,
            id: user.login.uuid,
          }));
          set({ users, loading: false });
        } catch (error) {
          set({ error: 'Failed to fetch users', loading: false });
        }
      },

      saveUser: async (user: User) => {
        set({ loading: true, error: null });
        try {
          const response = await axios.post(`${backendUrl ?? 'http://localhost:5001'}/api/users`, user);
          set((state) => ({
            savedUsers: [...state.savedUsers, response.data],
            loading: false,
          }));
        } catch (error: any) {
          if (axios.isAxiosError(error) && error.response?.status === 409) {
            set({ error: 'User already exists', loading: false });
          } else {
            set({ error: error.message || 'Failed to save user', loading: false });
          }
        }
      },

      deleteUser: async (id: string) => {
        set({ loading: true, error: null });
        try {
          await axios.delete(`${backendUrl ?? 'http://localhost:5001'}/api/users/${id}`);
          set((state) => ({
            savedUsers: state.savedUsers.filter((user) => user.id !== id),
            loading: false,
          }));
        } catch (error: any) {
          set({ error: error.message || 'Failed to delete user', loading: false });
        }
      },

      fetchSavedUsers: async () => {
        set({ loading: true, error: null });
        try {
          const response = await axios.get(`${backendUrl ?? 'http://localhost:5001'}/api/users`);
          set({ savedUsers: response.data, loading: false });
        } catch (error: any) {
          set({ error: error.message || 'Failed to fetch saved users', loading: false });
        }
      },

      fetchUserById: async (id: string) => {
        set({ loading: true, error: null });
        try {
          const response = await axios.get(`${backendUrl ?? 'http://localhost:5001'}/api/users/${id}`);
          set({ loading: false });
          return response.data;
        } catch (error: any) {
          set({ error: error.message || 'Failed to fetch user', loading: false });
          return null;
        }
      },

      updateUser: async (id: string, user: Partial<User>) => {
        set({ loading: true, error: null });
        try {
          const response = await axios.patch(`${backendUrl ?? 'http://localhost:5001'}/api/users/${id}`, user);
          set((state) => ({
            savedUsers: state.savedUsers.map((u) =>
              u.id === id ? response.data : u
            ),
            loading: false,
          }));
        } catch (error: any) {
          set({ error: error.message || 'Failed to update user', loading: false });
        }
      },

      updateRandomUserName: (id, name) => {
        set((state) => ({
          users: state.users.map((user) =>
            user.id === id ? { ...user, name } : user
          ),
        }));
      },
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({ users: state.users, savedUsers: state.savedUsers }),
    }
  )
); 