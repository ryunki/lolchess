// @ts-nocheck
import {useState, useEffect} from 'react'
import { Form, useNavigate, NavLink  } from 'react-router-dom';

import axios from 'axios'

const Header = ({showLogin, setShowLogin}) => {

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) =>{
    e.preventDefault()
    await axios.post('/api/users/login', {username,password})
      .then(response =>{
        console.log(response.data)
        const {success, userLoggedIn} = response.data
        if(success === 'User logged in'){
          localStorage.setItem('userInfo',JSON.stringify(userLoggedIn))
          setUsername('')
          setPassword('')
          setShowLogin(false)
          if(userLoggedIn.username === 'admin'){
            navigate('/admin')
          }
        }
      })
      .catch(error => {
        console.error(error.response.data.message ? error.response.data.message : error.response.data )
      })
  }

  const logoutHandler = () => {
    setShowLogin(true)
    navigate('/')
    localStorage.clear()
  }
  return (
    <div>
      {showLogin ?
        <form onSubmit={handleSubmit}>
          <label htmlFor="username">username</label>
            <input onChange={(e)=>{setUsername(e.target.value)}} 
              type="text" id="username" name="username" value={username} required/>
          <label htmlFor="password">password</label>
            <input onChange={(e)=>{setPassword(e.target.value)}} 
              type="password" id="password" name="password" value={password} required/>
          <button type="submit">submit</button>
        </form>
    :<div style={{display:'flex', gap:'5px'}}>welcome 
      <div onClick={()=>navigate('/admin')}>admin page</div>
      <div onClick={()=>logoutHandler()}>logout</div>
      </div>}
    </div>
  )
}

export default Header