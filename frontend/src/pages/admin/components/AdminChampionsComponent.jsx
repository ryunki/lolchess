// @ts-nocheck
import axios from "axios"
import { useEffect, useState, useRef, useCallback } from "react"

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
    }).catch(error=>{
      console.log(error)
    })
    setName('')
    setCost('')
    setAddTraits({})
  }

  const editChampionSubmit = (e, id) => {
    e.preventDefault()
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
    console.log('useEffect : get champions')
    getChampions().then(res=>{
      console.log(res)
      setDisplayChampions(res.champions)
    }).catch(error=>{
      console.log(error)
    })
    
  },[rerender])

  useEffect(()=>{
    console.log('useEffect : get traits')
    getTraits().then(res=>{
      setDisplayTraits(res.traits)
    }).catch(error=>{
      console.log(error)
    })
  },[])

  useEffect(() => {
    console.log('click use Effect')
    const handleClickOutside = (e) =>{
      if (detectClickOtherThanEdit.current && !detectClickOtherThanEdit.current.contains(e.target)){
        if (detectClickOtherThanEdit2.current && !detectClickOtherThanEdit2.current.contains(e.target)){
          console.log('clicked outside')
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
console.log('AC component')
  return (
    <>
      <div>AdminChampions</div>
      <div>
        <form onSubmit={e=>addNewChampionSubmit(e)}>
          <label htmlFor="name">Name</label>
          <input type="text" id="name" name="name" value={name} onChange={(e)=>{setName(e.target.value)}} required />
          <label htmlFor="cost">Cost</label>
          <input type="number" id="cost" name="cost" value={cost} onChange={(e)=>{setCost(e.target.value)}} required />
          {/* <input type="text" */}
          {/* if edit button is clicked, do not show traits here! (adding new champion section) */}
          {/* otherwise, show traits to be added to new champion */}
          {!editChampId && <>
              {/* {Object.keys(addTraits).length !== 0 && <div>Traits</div>}
              {Object.keys(addTraits).length !== 0 && Object.keys(addTraits).map((trait,idx)=>(
                <div key={addTraits[trait]}>
                  <div>{trait} </div><div onClick={()=>deleteTrait(trait)}>delete</div> 
                </div>
              ))} */}
              <DisplayAddedTraits addTraits={addTraits} deleteTrait={deleteTrait}/>
            </>
          }
          {/* {Object.entries(addTraits).map(([key,value]))} */}
          <button type="submit">Add New Champion</button>
        </form>

        {championUpdateMessage && championUpdateMessage}
      </div>
      {/* display all champion with cost and traits */}
      {displayChampions && Object.entries(displayChampions).map(([key,champ])=>(
      <div key={champ._id}>
        {/* {console.log(champ)} */}
        {/* when user clicks edit button, input field appears */}
        {editChampId === champ._id ? 
        <form ref={detectClickOtherThanEdit} onSubmit={e=>editChampionSubmit(e,champ._id)}>
          <label htmlFor="editName">Name</label>
            <input type="text" id="editName" name="editName" value={editName} placeholder={champ.name} onChange={(e)=>{setEditName(e.target.value)}} required />
          <label htmlFor="editCost">Cost</label>
            <input type="number" id="editCost" name="editCost" value={editCost} placeholder={champ.cost} onChange={(e)=>{setEditCost(e.target.value)}} required />
            {/* {Object.keys(addTraits).length !== 0 && <div>Traits</div>}
              {Object.keys(addTraits).length !== 0&& Object.keys(addTraits).map((trait,idx)=>(
                <div key={addTraits[trait]}>
                  {console.log(trait)}
                  <div>{trait} </div><div onClick={()=>deleteTrait(trait)}>delete</div> 
                </div>
              ))} */}
              <DisplayAddedTraits addTraits={addTraits} deleteTrait={deleteTrait}/>

          <button type="submit">edit</button>
        </form>
          : 
          <div> name: {champ.name}, cost: {champ.cost} 
            {(champ.traits).length !== 0 && (champ.traits).map((trait,idx)=>(
              <div key={trait._id}>{trait.name}</div>
            ))}
            <button onClick={()=>editButtonClickHandler(champ)}>edit</button>
            <button onClick={()=>deleteChampionHandler(champ._id)}>delete</button>
          </div>
        }
        </div>
      ))}
      <div ref={detectClickOtherThanEdit2}>
        <div>Traits</div>
        {/* display lists of traits for adding to new champs or to edit champion */}
        {displayTraits.length !== 0 && displayTraits.map((trait,idx)=>(
            <div key={trait._id} onClick={()=>addTraitsHandler(trait)}>{trait.name}</div>
            // <div key={trait._id} onClick={()=>setAddTraits(prev => ([...prev, ...{[trait.name]: trait._id}]))}>{trait.name}</div>
        ))}
      </div>
    </>
  )
}

const DisplayAddedTraits = ({addTraits,deleteTrait}) =>{
  return (
    <>
      {Object.keys(addTraits).length !== 0 && <div>Traits</div>}
      {Object.keys(addTraits).length !== 0&& Object.keys(addTraits).map((trait,idx)=>(
        <div key={addTraits[trait]}>
          <div>{trait} </div><div onClick={()=>deleteTrait(trait)}>delete</div> 
        </div>
      ))}
    </>
  )
}
export default AdminChampionsComponent