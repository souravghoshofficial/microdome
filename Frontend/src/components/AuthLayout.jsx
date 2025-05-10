import React from 'react'
import { Outlet, Navigate } from 'react-router'
import { useSelector } from 'react-redux';

const AuthLayout = ({}) => {
  const isLoggedIn = useSelector((state) => state.auth.status);
  
    if(!isLoggedIn){
        return <Outlet />  
    }
  return (
     <Navigate to ="/" />
  )
}

export default AuthLayout