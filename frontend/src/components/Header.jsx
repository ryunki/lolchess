// @ts-nocheck
import {useState} from 'react'
import { useNavigate } from 'react-router-dom';

import axios from 'axios'

import '../css/Header.css'

const Header = ({showLogin, setShowLogin, backToAdmin, setBackToAdmin, token, setToken}) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const handleSubmit = async (e) =>{
    e.preventDefault()
    await axios.post('/api/users/login', {username,password})
      .then(response =>{
        const {success, userLoggedIn} = response.data
        if(success === 'User logged in'){
          localStorage.setItem('userInfo',JSON.stringify(userLoggedIn))
          setUsername('')
          setPassword('')
          setShowLogin(false)
          if(userLoggedIn.username === 'admin'){
            setBackToAdmin(false)
            navigate('/admin')
            console.log('username admin logged in')
          }else{
            navigate('/')
          }
          setToken(userLoggedIn.username)
        }
      })
      .catch(error => {
        console.error(error )
      })
  }

  const logoutHandler = async () => {
    setShowLogin(true)
    localStorage.clear()
    await axios.get('/api/logout')
    navigate('/')
    console.log('logout')
    
  }
  const redirectHandler = () => {
    if(backToAdmin){
      navigate('/admin')
      setBackToAdmin(false)
    }
}

  return (
    <div className="header-container">
      {showLogin ?
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
      <div onClick={()=>redirectHandler()} style={{alignSelf: 'center', cursor:'pointer'}}>{token==='admin' ? (backToAdmin ? 'Back to Admin Page' : 'Admin'):
      'Welcome '+token+'!'}</div>
        <button className="login-button" onClick={()=>logoutHandler()}>Logout</button>
      </div>}
    </div>
  )
}

export default Header