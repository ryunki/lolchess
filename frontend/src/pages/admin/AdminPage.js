// @ts-nocheck
import React, {useEffect,useState} from 'react'
import { Navigate, NavLink, Outlet } from 'react-router-dom';
import axios from 'axios';

import { useRecoilState, useRecoilValue } from 'recoil';
import { userInfo } from '../../recoil/stateAtoms';
import '../../css/AdminPage.css'

const AdminPage = ({clickToHomePage}) => {
  const [userRecoil, setUserRecoil] = useRecoilState(userInfo)
  useEffect(() => {
    // const storedAuth = JSON.parse(localStorage.getItem('userInfo'))
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
  console.log('admin page')
  return (
    <>
      {userRecoil.username === 'admin' ? 
      <>
      <div className='navbar'>
        <NavLink to='/admin/champions' className={({isActive})=>(isActive?`active`:`inactive`)}>Champions</NavLink>
        <NavLink to='/admin/traits' className={({isActive})=>(isActive?'active':'inactive')}>Traits</NavLink>
        <NavLink to='/' onClick={()=>clickToHomePage()} className={({isActive})=>(isActive?'active':'inactive')}>Back to home</NavLink>
      </div>
        <Outlet/> 
        </>: 
      <Navigate to="/" />}
    </>
  )
}

export default AdminPage