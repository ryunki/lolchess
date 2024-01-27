// @ts-nocheck
import React, {useEffect, useState} from 'react'
import { Navigate, NavLink, Outlet } from 'react-router-dom';
import axios from 'axios';
import Header from '../../components/Header';
import '../../css/AdminPage.css'

const AdminPage = ({clickToHomePage, token, setToken}) => {
  const [user, setUser] = useState('')
  useEffect(() => {
    console.log('pr')
    const fetchToken = async () => {
      try {
        const response = await axios.get('/api/get-token');
        if (response.data) {
          console.log('data from backend token: ', response.data);
          setToken(response.data);
          // setUser(response.data)
        }
      } catch (error) {
        console.error('Error fetching token:', error);
      }
    };
    fetchToken();
  }, [token])
  console.log('user in admin page: ', token, 'user: ',user)
  return (
    <>
      {/* <Header showLogin={showLogin} setShowLogin={setShowLogin} backToAdmin = {backToAdmin} setBackToAdmin={setBackToAdmin}/> */}
      <div className='navbar'>
          <NavLink to='/admin/champions' className={({isActive})=>(isActive?`active`:`inactive`)}>Champions</NavLink>
          <NavLink to='/admin/traits' className={({isActive})=>(isActive?'active':'inactive')}>Traits</NavLink>
          <NavLink to='/' onClick={()=>clickToHomePage()} className={({isActive})=>(isActive?'active':'inactive')}>Back to home</NavLink>
      </div>
      {token === 'admin' ? <Outlet/> : <Navigate to="/" />}
    </>
  )
}

export default AdminPage