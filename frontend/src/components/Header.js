// @ts-nocheck
import React from 'react'
import HeaderComponent from './HeaderComponent'
import axios from 'axios'

const Header = ({backToAdmin, setBackToAdmin}) => {
  
  const userLoginApi = async (username,password) =>{
    const {data} = await axios.post('/api/users/login', {username,password})
    console.log(data)
    return data
  }

  return (
    <HeaderComponent backToAdmin={backToAdmin} setBackToAdmin={setBackToAdmin} userLoginApi={userLoginApi}/>
  )
}

export default Header