import { useContext } from "react";
import { Navigate } from "react-router";
import { useLocation } from "react-router";
import { AuthContext } from "../Context/AuthContext";

const PrivateRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location?.pathname }} />;
  }

  return children;
};

export default PrivateRoute;