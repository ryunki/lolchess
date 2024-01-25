// @ts-nocheck
import axios from "axios"
import { useEffect, useState, useRef, useCallback } from "react"
import AdminChampionsComponent from "./components/AdminChampionsComponent"


const AdminChampions = () => {
  const getChampions = async () => {
    const {data} = await axios.get('/api/admin/champions')
    return data
  }

  const getTraits = async () => {
    const {data} = await axios.get('/api/admin/traits')
    return data
  }
  // collect traits id to be added to new champion
  const collectTraitsId = (addTraits) =>{
    const traitId = []
    Object.entries(addTraits).forEach(([trait, id ])=>{
      traitId.push(id)
    })
    return traitId
  }
  const addNewChampion = async(name , cost, addTraits) =>{
    const traitId = collectTraitsId(addTraits)
    const {data} = await axios.post('/api/admin/champion', {
      name:name, 
      cost:parseInt(cost), 
      traits: traitId
    })
    return data
  }

  const editChampion = async(id, editName, editCost, addTraits) =>{
    const traitId = collectTraitsId(addTraits)
    console.log(id, editName, editCost, addTraits)
    console.log(traitId)
    const {data} = await axios.put(`/api/admin/champion/${id}`, {
      name:editName,
      cost:parseInt(editCost),
      traits: traitId
    })
    return data
  }
  return (
    <AdminChampionsComponent getChampions={getChampions} getTraits={getTraits} addNewChampion={addNewChampion} editChampion={editChampion}/>
  )
}

export default AdminChampions