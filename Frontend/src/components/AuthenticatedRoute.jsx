import React from 'react'
import { Outlet, Navigate } from 'react-router'
import { useSelector } from 'react-redux';

const AuthenticatedRoute = ({}) => {
  const isLoggedIn = useSelector((state) => state.auth.status);
  
    if(!isLoggedIn){
       return <Navigate to ="/" />
    }
  return (
    <Outlet />
  )
}

export default AuthenticatedRoute