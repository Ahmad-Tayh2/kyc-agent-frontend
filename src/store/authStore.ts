import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";

// type User = {
//   id: string;
//   name: string;
//   email: string;
// };

type AuthState = {
  //   user: User | null;
  user: any;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: any /*User*/, token: string) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        token: null,
        isAuthenticated: false,

        login: (user, token) =>
          set({
            user,
            token,
            isAuthenticated: true,
          }),

        logout: () =>
          set({
            user: null,
            token: null,
            isAuthenticated: false,
          }),
      }),
      {
        name: "auth-storage", // key in localStorage
      }
    ),
    { name: "AuthStore" }
  )
);
