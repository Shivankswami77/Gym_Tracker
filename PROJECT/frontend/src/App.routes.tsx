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

              {/* Protected Route: Home */}
              <Route
                path="/"
                element={
                  userDetails?._id ? (
                    <HeaderNav />
                  ) : (
                    <Navigate to="/sign-in" replace />
                  )
                }
              />

              {/* Catch-all Route: Redirect unmatched routes */}
              <Route
                path="*"
                element={
                  <Navigate to={userDetails?._id ? "/" : "/sign-in"} replace />
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
