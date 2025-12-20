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
  expires_in: string | null;
  isAuthenticated: boolean;
  login: (user: any /*User*/, token: string, expires_in: string) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        token: null,
        expires_in: null,
        isAuthenticated: false,

        login: (user, token, expires_in) =>
          set({
            user,
            token,
            expires_in,
            isAuthenticated: true,
          }),

        logout: () =>
          set({
            user: null,
            token: null,
            expires_in: null,
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
