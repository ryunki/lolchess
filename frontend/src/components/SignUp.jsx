// @ts-nocheck
import { useState, useEffect, useRef } from "react"
import "../css/SignUp.css"
import axios from "axios"
import { useRecoilState } from "recoil"
import { userInfo } from "recoil/stateAtoms"

const SignUp = ({setOpenSignUpModal}) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')
  const [user, setUser] = useRecoilState(userInfo)
  const detectClickOtherThanEdit = useRef()

  const signUpHandler = async () =>{
    console.log(username, password, repeatPassword)
    if(username && password && repeatPassword){
      await axios.post('/api/users/register',{username,password,repeatPassword}).then(res=>{
        if(res.data.success === 'User created'){
          setUser(res.data.userCreated.username)
          setOpenSignUpModal(false)
        }
      }).catch(error=>{
        console.log(error)
      })
    }else{
      console.log('missing input')
    }
  }

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
    <div className="sign-up-container font-white" ref={detectClickOtherThanEdit}>
      <div className="header">
        <div>Create new account</div><label className="close"onClick={()=>setOpenSignUpModal(false)}>close</label>
      </div>
      <div>
        <label>User name</label>
        <input type="text" onChange={e=>setUsername(e.target.value)} value={username}/>
      </div>
      <div>
        <label>Password</label>
        <input type="password" onChange={e=>setPassword(e.target.value)} value={password}/>
      </div>
      <div>
        <label>Repeat password</label>
        <input type="password" onChange={e=>setRepeatPassword(e.target.value)} value={repeatPassword} />
      </div>
      <div className="footer">
        <div onClick={()=>signUpHandler()}>Sign up</div>
      </div>
    </div>
  )
}

export default SignUp