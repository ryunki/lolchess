// @ts-nocheck
import {useState} from 'react'
import { useNavigate,useLocation  } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import { userInfo,logoutSelector } from '../recoil/stateAtoms';

import axios from 'axios'

import '../css/Header.css'

const Header = ({backToAdmin, setBackToAdmin}) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [userRecoil, setUserRecoil] = useRecoilState(userInfo);
  const {logout} = useRecoilValue(logoutSelector);
  const navigate = useNavigate()
  const location = useLocation()
  const handleSubmit = async (e) =>{
    e.preventDefault()
    await axios.post('/api/users/login', {username,password})
      .then(response =>{
        const {success, userLoggedIn} = response.data
        if(success === 'User logged in'){
          localStorage.setItem('userInfo',JSON.stringify(userLoggedIn))
          setUsername('')
          setPassword('')
          if(userLoggedIn.username === 'admin'){
            setBackToAdmin(false)
            navigate('/admin')
            console.log('username admin logged in')
          }else{
            navigate('/')
          }
          setUserRecoil(userLoggedIn)
        }
      })
      .catch(error => {
        console.error(error )
      })
  }

  const logoutHandler = async () => {
    setUserRecoil('')
    logout()
    navigate('/')
  }
  const redirectHandler = () => {
    console.log(location, backToAdmin)
    if(backToAdmin){
      navigate('/admin')
      setBackToAdmin(false)
    }
}
console.log(userRecoil)
  return (
    <div className="header-container">
      {!userRecoil ?
        <div className="header-wrapper">
          <div>
            <label className="label font-white" htmlFor="username">User name</label>
              <input className="login-input-field" onChange={(e)=>{setUsername(e.target.value)}} 
                type="text" id="username" name="username" value={username} required/>
          </div>
          <div>
            <label className="label font-white" htmlFor="password">Password</label>
              <input className="login-input-field" onChange={(e)=>{setPassword(e.target.value)}} 
                type="password" id="password" name="password" value={password} required/>
          </div>
          <button className="login-button" onClick={handleSubmit}>Login</button>
        </div>
    :<div className="header-wrapper-admin font-white">
      <div onClick={()=>redirectHandler()} style={{alignSelf: 'center', cursor:'pointer'}}>
        {/* this logic is to prevent misbehaviors when refreshing the website */}
        {userRecoil.username==='admin' ? (backToAdmin ? 'Back to Admin Page' : 'Admin'):
      'Welcome '+userRecoil.username+'!'}</div>
        <button className="login-button" onClick={()=>logoutHandler()}>Logout</button>
      </div>}
    </div>
  )
}

export default Header