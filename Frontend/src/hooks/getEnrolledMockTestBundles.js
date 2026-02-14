import { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addBundles,removeBundles } from "../features/enrolledMockTestBundles/enrolledMockTestBundlesSlice";
const ApiUrl = import.meta.env.VITE_BACKEND_URL;

export const useEnrolledTestBundles = () =>{
  const dispatch=useDispatch()
  useEffect(()=>{
    const fetchEnrolledMockTestBundles = async () =>{
      try {
        const res = await axios.get(`${ApiUrl}/users/enrolled-mock-test-bundles`,{
          withCredentials: true
        });
        dispatch(addBundles(res.data?.bundles))

      } catch (error) {
        console.error(error.message);
        dispatch(removeBundles());
      }
    }
    fetchEnrolledMockTestBundles();
  },[dispatch])
}