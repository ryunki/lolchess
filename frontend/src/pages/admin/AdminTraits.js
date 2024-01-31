// @ts-nocheck
import axios from "axios"
import { useEffect, useState } from "react"
import AdminTraitsComponent from "./components/AdminTraitsComponent"


const AdminTraits = ({openModal}) => {

  const getTraits = async() =>{
    const {data} = await axios.get('/api/content/traits')
    // setDisplayTraits(data.traits)
    return data
  }
  const addTrait = async (name, activation)=> {
    // console.log(name, activation)
    const {data} = await axios.post('/api/admin/trait',{ name, activation })
    return data
  }
  
  return (
    <AdminTraitsComponent getTraits={getTraits} addTrait={addTrait} openModal={openModal}/>
  )
}

export default AdminTraits