import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist<any>(
    (set) => ({
      isLoggedIn: false,
      userDetails: {},
      login: (response: any) => {
        set({
          userDetails: response,
          isLoggedIn: true,
        });
      },
      logout: () => {
        set({
          isLoggedIn: false,
          accessToken: undefined,
          userDetails: null,
        });
        localStorage.clear();
      },
    }),
    {
      name: "_me",
    }
  )
);

export default useAuthStore;
