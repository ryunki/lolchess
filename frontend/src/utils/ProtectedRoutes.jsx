// @ts-nocheck
import axios from 'axios';
import React, {useEffect, useState} from 'react'
import { Navigate, Outlet} from 'react-router-dom';

const ProtectedRoutes = ({admin, token, setToken}) => {
  console.log('admin: ',admin)
  useEffect(() => {
    console.log('pr')
    const fetchToken = async () => {
      try {
        const response = await axios.get('/api/get-token');
        if (response.data) {
          console.log('data from backend token: ', response.data);
          setToken(response.data);
        }
      } catch (error) {
        console.error('Error fetching token:', error);
      }
    };
    fetchToken();
  }, [token])
  return (
    <>
    {console.log(token)}
    {token === 'admin' ? <Outlet/> : <Navigate to="/" />}
    </>
  )
}

export default ProtectedRoutes