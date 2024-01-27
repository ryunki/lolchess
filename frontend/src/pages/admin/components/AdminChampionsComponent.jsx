// @ts-nocheck
import axios from "axios"
import React, { useEffect, useState, useRef, useCallback } from "react"
import {  useSetRecoilState, useRecoilValue } from 'recoil'
import { userInfo,logoutSelector } from '../../../recoil/stateAtoms';
import '../../../css/AdminPage.css'

const AdminChampionsComponent = ({getChampions, getTraits, addNewChampion, editChampion}) => {
  // display champions from DB
  const [displayChampions, setDisplayChampions] = useState({})
  const [championUpdateMessage, setChampionUpdateMessage] = useState('')
  // display traits for selection
  const [displayTraits, setDisplayTraits] = useState([])
  // save all the traits a user selected for updating
  const [addTraits, setAddTraits] = useState({})
  // data for adding new champion
  const [name, setName] = useState('')
  const [cost, setCost] = useState('')
  // data for editing champion
  const [editName, setEditName] = useState('')
  const [editCost, setEditCost] = useState('')
  
  // for opening edit field selected, and not displaying traits for adding new champion section
  const [editChampId, setEditChampId] = useState('')
  
  const [rerender, setRerender] = useState(false)
  const {logout} = useRecoilValue(logoutSelector);
  const userRecoil = useSetRecoilState(userInfo)

  // controlling focus for edit section (input fields)
  const detectClickOtherThanEdit = useRef()
  const detectClickOtherThanEdit2 = useRef()

  const deleteChampionHandler = async(id) =>{
    await axios.delete(`/api/admin/champion/${id}`).then(res=>{
      const message = res.data
      console.log(message)
      // getChampions()
      setChampionUpdateMessage(message)
      setEditChampId('')
      setRerender(!rerender)
    }).catch(error=>{
      console.log(error)
    })
  }
  
  const addNewChampionSubmit = (e) =>{
    e.preventDefault()
    addNewChampion(name, cost, addTraits).then(res=>{
      const message = res.success
      setDisplayChampions(prev => ({...prev, [Object.keys(prev).length]: res.championCreated}))
      setChampionUpdateMessage(message)
      setRerender(!rerender)
    }).catch(error=>{
      console.log(error)
    })
    setName('')
    setCost('')
    setAddTraits({})
  }

  const editChampionSubmit = (id) => {
    // e.preventDefault()
    editChampion(id, editName, editCost, addTraits).then(res=>{
      const message = res.success
      setChampionUpdateMessage(message)
      setEditChampId('')
      setRerender(!rerender)
    }).catch(error=>{
      console.log(error)
    })
    setEditName('')
    setEditCost('')
    setAddTraits({})
  }

  // when edit button is clicked
  const editButtonClickHandler = (champ) => {
    const {_id, name, cost, traits} = champ
    setEditChampId(_id)
    // display existing data, when edit button is clicked
    setEditName(name)
    setEditCost(cost)
    let traitObject = {}
    traits.forEach(trait =>{
      traitObject[trait.name] = trait._id
    })
    setAddTraits(traitObject)
  }

  const addTraitsHandler = (trait) => {
    setAddTraits(prev=>{
      if(prev[trait.name]){
        // This is using object destructuring assignment. 
        // Create a copy of the state object without the specified key
        const { [trait.name]: deletedTrait, ...updatedTraits } = prev;
        return updatedTraits;
      }else{
        return {...prev,[trait.name]:trait._id}
      }
    })
  }

  const deleteTrait = (trait) => {
    setAddTraits(prev=>{
      if(prev[trait]){
        // This is using object destructuring assignment. 
        // Create a copy of the state object without the specified key
        const { [trait]: deletedTrait, ...updatedTraits } = prev;
        return updatedTraits;
      }else{
        return {...prev,[trait]:trait._id}
      }
    })
  }
  useEffect(()=>{
    getChampions().then(res=>{
      console.log(res)
      setDisplayChampions(res.champions)
    }).catch(error=>{
      logout()
      userRecoil('')
      console.log(error)
    })
    
  },[rerender])

  useEffect(()=>{
    getTraits().then(res=>{
      setDisplayTraits(res.traits)
    }).catch(error=>{
      console.log(error)
    })
  },[])

  // for detecting mouse click. 
  // edit field is closed when clicked outside of the edit <div>
  useEffect(() => {
    const handleClickOutside = (e) =>{
      if (detectClickOtherThanEdit.current && !detectClickOtherThanEdit.current.contains(e.target)){
        if (detectClickOtherThanEdit2.current && !detectClickOtherThanEdit2.current.contains(e.target)){
          setEditChampId('')
          setAddTraits({})
        }
      }
    }
    // Add event listener when the component mounts
    document.addEventListener('mousedown', handleClickOutside)
    // Remove event listener when the component unmounts
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className="container">
      <div className="page-title">Add New Champions</div>
      <div className="input-container">
        <div className="input-wrapper">
          <label htmlFor="name">Name</label>
          <input type="text" id="name" name="name" value={name} onChange={(e)=>{setName(e.target.value)}} required />
        </div>
        <div className="input-wrapper">
          <label htmlFor="cost">Cost</label>
          <input className="small" type="number" id="cost" name="cost" value={cost} onChange={(e)=>{setCost(e.target.value)}} required />
        </div>
        <div>
          <div className="display-button"onClick={addNewChampionSubmit} >Add</div>
        </div>
          {/* if edit button is clicked, do not show traits here! (adding new champion section) */}
          {/* otherwise, show traits to be added to new champion */}
      </div>
      {!editChampId && 
            <DisplayAddedTraits addTraits={addTraits} deleteTrait={deleteTrait}/>
        }
        {championUpdateMessage && 
          <div className="display-updated-message">
            {championUpdateMessage}
          </div>
        }
      
      <div className="champions-and-trait-container">

        {/* display all champion with cost and traits */}
        <div className="champions-container">
          {displayChampions && Object.entries(displayChampions).map(([key,champ])=>(
          <React.Fragment key={champ._id}>
           
            {/* when user clicks edit button, input field appears */}
            {editChampId === champ._id ? 
            <div className="input-container-display-champions" ref={detectClickOtherThanEdit} >
              <div>
                <div className="input-wrapper">
                  {/* <label htmlFor="editName">Name</label> */}
                  <input type="text" id="editName" name="editName" value={editName} placeholder={champ.name} onChange={(e)=>{setEditName(e.target.value)}} required />
                  {/* <label htmlFor="editCost">Cost</label> */}
                  <input className="small" type="number" id="editCost" name="editCost" value={editCost} placeholder={champ.cost} onChange={(e)=>{setEditCost(e.target.value)}} required />
                </div>
                <div className="">
                  <DisplayAddedTraits addTraits={addTraits} deleteTrait={deleteTrait}/>
                </div>
              </div>
              <div className="edit-button-wrapper">
                <div className="display-button" onClick={()=>editChampionSubmit(champ._id)}>edit</div>
              </div>
              
            </div>
              : 
              <div className="input-container-display-champions"> 
                <div className="">
                  {champ.name}   {champ.cost} 
                </div>
                <div className="trait-and-button-container">
                  <div className="display-trait-wrapper">
                    {(champ.traits).length !== 0 && (champ.traits).map((trait,idx)=>(
                      <div className="display-trait" key={idx}>{trait.name}</div>
                      ))}
                  </div>
                  <div className="button-container ">
                    <div className="display-button" onClick={()=>editButtonClickHandler(champ)}>edit</div>
                    <div className="display-button-delete" onClick={()=>deleteChampionHandler(champ._id)}>delete</div>
                  </div>
                </div>  
              </div>
            }
            </React.Fragment>
          ))}
        </div>
        {displayTraits.length !== 0 && 
          <div className="traits-container-champions-page"ref={detectClickOtherThanEdit2}>
            <div className="container-title">Click to add</div>
            {/* display lists of traits for adding to new champs or to edit champion */}
            <div className="traits-wrapper">
              {displayTraits.map((trait,idx)=>(
                <div className="display-trait-add" key={trait._id} onClick={()=>addTraitsHandler(trait)}>{trait.name}</div>
                // <div key={trait._id} onClick={()=>setAddTraits(prev => ([...prev, ...{[trait.name]: trait._id}]))}>{trait.name}</div>
                ))}
            </div>
          </div>
        }
      </div>
    </div>
  )
}

const DisplayAddedTraits = ({addTraits,deleteTrait}) =>{
  return (<>
        <div className="added-trait-container">
        {/* {Object.keys(addTraits).length !== 0 && <div>Traits: </div>} */}
          {Object.keys(addTraits).length !== 0&& Object.keys(addTraits).map((trait,idx)=>(
            <div className="added-trait-wrapper" key={addTraits[trait]}>
              {/* <div className="display-trait">{trait} </div><div className="display-button" onClick={()=>deleteTrait(trait)}>delete</div>  */}
              <div className="display-trait">{trait} </div><div className="display-button-delete" onClick={()=>deleteTrait(trait)}>delete</div> 
            </div>
          ))}
        </div>
      </>
  )
}
export default AdminChampionsComponent