import useAuthStore from "@src/store/authStore";
import React, { JSX } from "react";
import { Route, Navigate } from "react-router-dom";

const PrivateRoute: React.FC<{ element: JSX.Element; path: string }> = ({
  element,
  path,
}) => {
  const { userDetails } = useAuthStore();

  return (
    <Route
      path={path}
      element={userDetails?.id ? element : <Navigate to="/sign-in" replace />}
    />
  );
};

export default PrivateRoute;
