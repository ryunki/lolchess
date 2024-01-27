// @ts-nocheck
import React, {useEffect,useState} from 'react'
import { Navigate, NavLink, Outlet } from 'react-router-dom';
import axios from 'axios';

import { useRecoilState, useRecoilValue } from 'recoil';
import { userInfo } from '../../recoil/stateAtoms';
import '../../css/AdminPage.css'

const AdminPage = ({clickToHomePage}) => {
  const [userRecoil, setUserRecoil] = useRecoilState(userInfo)
  const [isAuth, setIsAuth] = useState('');
  useEffect(() => {
    axios.get('/api/get-token')
    .then(response=>{
      if(response.data){
        setUserRecoil(response.data);
      }
    }).catch((error) => {
      console.error('Error fetching token:', error);
    });
  }, [setUserRecoil])
  return (
    <>
      <div className='navbar'>
          <NavLink to='/admin/champions' className={({isActive})=>(isActive?`active`:`inactive`)}>Champions</NavLink>
          <NavLink to='/admin/traits' className={({isActive})=>(isActive?'active':'inactive')}>Traits</NavLink>
          <NavLink to='/' onClick={()=>clickToHomePage()} className={({isActive})=>(isActive?'active':'inactive')}>Back to home</NavLink>
      </div>
      {userRecoil.username === 'admin' ? <Outlet/> : <Navigate to="/" />}
    </>
  )
}

export default AdminPage