import React, {useEffect,useState} from 'react'
import { Navigate, NavLink, Outlet } from 'react-router-dom';
import axios from 'axios';

import { useRecoilState, useRecoilValue } from 'recoil';
import { userInfo } from './recoil/stateAtoms';

const ProtectedRoute = ({clickToHomePage}) => {
  const [userRecoil, setUserRecoil] = useRecoilState(userInfo)
  // user authentication
  useEffect(() => {
    axios.get('/api/get-token')
      .then(response=>{
        if(response.data){
          setUserRecoil(response.data);
          localStorage.setItem('userInfo',JSON.stringify(response.data))
        }
      }).catch((error) => {
        console.error('Error fetching token:', error);
      });
  }, [setUserRecoil])
  
  return (
    <>
      {userRecoil.username === 'admin' ? 
      <>
      <div className='navbar'>
        <NavLink to='/admin/champions'  className={({isActive})=>(isActive?`active`:`inactive`)}>Champions</NavLink>
        <NavLink to='/admin/traits' className={({isActive})=>(isActive?'active':'inactive')}>Traits</NavLink>
        <NavLink to='/' onClick={()=>clickToHomePage()} className={({isActive})=>(isActive?'active':'inactive')}>Back to home</NavLink>
      </div>
        <Outlet/> 
        </>: 
      <Navigate to="/"/>}
    </>
  )
}

export default ProtectedRoute