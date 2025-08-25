import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

export const RedirectIfToken = ({ children }: { children: ReactNode }) => {
  const token = localStorage.getItem("ingenium-admin-token");
  let location = useLocation();

  // Redirect user to dashboard if user is logged in
  if (token)
    return <Navigate to="/overview" state={{ from: location }} replace />;

  return children;
};
