import { Outlet, Navigate } from "react-router";
import { useSelector } from "react-redux";

const AdminLayout = () => {
  const isLoggedIn = useSelector((state) => state.auth.status);
  const role = useSelector((state) => state.auth?.userData?.role);

  
  if (isLoggedIn === undefined || role === undefined) {
    return <div>Loading...</div>; 
  }

  if (isLoggedIn && role === "admin") {
    return <Outlet />;
  }

  return <Navigate to="/login" />;


};

export default AdminLayout;
