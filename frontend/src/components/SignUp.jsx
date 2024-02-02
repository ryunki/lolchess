// @ts-nocheck
import { useState, useEffect, useRef } from "react"
import axios from "axios"

import "../css/SignUp.css"

const SignUp = ({setOpenSignUpModal, setUserRecoil}) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')
  const [message, setMessage] = useState('')
  const detectClickOtherThanEdit = useRef()

  const signUpHandler = async () =>{
    if(username && password && repeatPassword){
      await axios.post('/api/users/register',{username,password,repeatPassword}).then(res=>{
        if(res.data.success === 'User created'){
          setOpenSignUpModal(false)
          localStorage.setItem('userInfo', JSON.stringify(res.data.userCreated))
          setUserRecoil(res.data.userCreated)
        }
      }).catch(error=>{
        setMessage(error.response.data)
      })
    }else{
      setMessage('missing input')
    }
  }

  useEffect(()=>{
    setMessage('')
  },[username,password,repeatPassword])

  // when clicked outside of the modal. make it disappear
useEffect(()=>{
  const handleClickOutside = (e) =>{
    if (detectClickOtherThanEdit.current && !detectClickOtherThanEdit.current.contains(e.target)){
      setOpenSignUpModal(false)
    }
  }
  // Add event listener when the component mounts
  document.addEventListener('mousedown', handleClickOutside)
  // Remove event listener when the component unmounts
  return () => {
    document.removeEventListener('mousedown', handleClickOutside)
  }
},[])
  return (
    <>
    <div className="dim-overlay"></div>
    <div className="signup-container font-white" ref={detectClickOtherThanEdit}>
      <div className="signup-header">
        <div>Create new account</div><label className="close"onClick={()=>setOpenSignUpModal(false)}>X</label>
      </div>
      <div className="signup-input-wrapper">
        <label className="signup-label">User name</label>
        <input className="signup-input" type="text"id="username" name="username" placeholder="Enter your username" onChange={e=>setUsername(e.target.value)} value={username}/>
      </div>
      <div className="signup-input-wrapper">
        <label className="signup-label">Password</label>
        <input className="signup-input" type="password" id="password" name="password" placeholder="Enter your password"onChange={e=>setPassword(e.target.value)} value={password}/>
      </div>
      <div className="signup-input-wrapper">
        <label className="signup-label">Repeat password</label>
        <input className="signup-input" type="password" id="repeatPassword" name="repeatPassword" placeholder="Repeat your password"onChange={e=>setRepeatPassword(e.target.value)} value={repeatPassword} />
      </div>
        {message && <div style={{textAlign:'center', marginBottom:"5px"}}>{message}</div>}
      <div className="signup-footer">
        <div className="signup-button" onClick={()=>signUpHandler()}>Sign up</div>
      </div>
      
    </div>
    </>
  )
}

export default SignUp