import { Outlet, Navigate } from "react-router";
import { useSelector } from "react-redux";

const AdminLayout = () => {
  const isLoggedIn = useSelector((state) => state.auth.status);
  const role = useSelector((state) => state.auth?.userData?.role);


  if(!isLoggedIn) {
    return <Navigate to="/login" />
  }

  
  if (role === undefined) {
    return <div className="w-full h-screen flex items-center justify-center">Loading...</div>; 
  }

  if (role === "admin") {
    return <Outlet />;
  }

  return <Navigate to="/" />;


};

export default AdminLayout;
