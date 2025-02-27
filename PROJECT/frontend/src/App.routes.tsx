import React from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import HeaderNav from "./components/layout-components/header-nav/Header-Nav";
import { ChakraProvider } from "@chakra-ui/react";
import SignIn from "@src/pages/auth/sign-in";
import { ToastContainer } from "react-toastify";
import useAuthStore from "./store/authStore";
import SignUp from "./pages/auth/sign-up";
import MyProfile from "./pages/my-profile/my-profile";
import UsersList from "./pages/users/users-list";
import AssignWorkout from "./pages/users/assign-workout/assign-workout";

const queryClient = new QueryClient();

const App: React.FC = () => {
  const { userDetails } = useAuthStore();
  console.log(userDetails, "userDetails");

  return (
    <>
      <Router>
        <ChakraProvider>
          <QueryClientProvider client={queryClient}>
            <Routes>
              {/* Public Route: SignIn */}
              <Route path="/sign-in" element={<SignIn />} />
              <Route path="/sign-up" element={<SignUp />} />

              {/* Protected Route: Home */}
              <Route path="/" element={<HeaderNav />} />

              {/* Catch-all Route: Redirect unmatched routes */}

              <Route
                path="/my-profile/:id"
                element={
                  <>
                    {" "}
                    <HeaderNav />
                    <MyProfile />
                  </>
                }
              />
              <Route
                path="/users-list"
                element={
                  <>
                    <HeaderNav />
                    <UsersList />
                  </>
                }
              />
              <Route
                path="/assign-workout-to-user/:id"
                element={
                  <>
                    <HeaderNav />
                    <AssignWorkout />
                  </>
                }
              />
            </Routes>
          </QueryClientProvider>
        </ChakraProvider>
      </Router>
      <ToastContainer />
    </>
  );
};

export default App;
