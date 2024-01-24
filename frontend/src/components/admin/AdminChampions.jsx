// @ts-nocheck
import axios from "axios"
import { useEffect, useState, useRef, useCallback } from "react"


const AdminChampions = () => {
  // display champions from DB
  const [displayChampions, setDisplayChampions] = useState([])
  const [championUpdateMessage, setChampionUpdateMessage] = useState('')
  // display traits for selection
  const [displayTraits, setDisplayTraits] = useState([])
  // save all the traits a user selected for updating
  const [addTraits, setAddTraits] = useState({})
  // for adding new champion
  const [name, setName] = useState('')
  const [cost, setCost] = useState('')
  const [editName, setEditName] = useState('')
  const [editCost, setEditCost] = useState('')
  
  // for opening edit field selected
  const [editChampId, setEditChampId] = useState('')

  const detectClickOtherThanEdit = useRef()
  const detectClickOtherThanEdit2 = useRef()

  const getChampions = async () => {
    const {data} = await axios.get('/api/admin/champions')
    console.log(data)
    setDisplayChampions(data.champions)
    return data
  }

  const getTraits = async () => {
    const {data} = await axios.get('/api/admin/traits')
    console.log(data.traits)
    setDisplayTraits(data.traits)
  }

  const addNewChampion = async() =>{
    const traitId = []
    Object.entries(addTraits).forEach(([trait, id ])=>{
      // console.log(trait, id)
      traitId.push(id)
    })
    await axios.post('/api/admin/champion', {
      name:name,
      cost:parseInt(cost),
      traits: traitId
    }).then(res=>{
      const message = res.data.success
      getChampions()
      setChampionUpdateMessage(message)
    }).catch(error=>{
      console.log(error)
    })
  }

  const editChampion = async(id) =>{
    const traitId = []
    Object.entries(addTraits).forEach(([trait, id])=>{
      // console.log(trait, id)
      traitId.push(id)
    })
    await axios.put(`/api/admin/champion/${id}`, {
      name:editName,
      cost:parseInt(editCost),
      traits: traitId
    }).then(res=>{
      const message = res.data.success
      getChampions()
      setChampionUpdateMessage(message)
      setEditChampId('')
    }).catch(error=>{
      console.log(error)
    })
  }
  
  const addNewChampionSubmit = (e) =>{
    e.preventDefault()
    addNewChampion()
    setName('')
    setCost('')
    setAddTraits({})
  }

  const editChampionSubmit = (e, id) => {
    e.preventDefault()
    editChampion(id)
    setEditName('')
    setEditCost('')
    setAddTraits({})
  }

  const editHandler = (champ) => {
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
    console.log(trait)
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

  useEffect(() => {
    getChampions()
    getTraits()
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
      document.addEventListener('mousedown', handleClickOutside)
    }
  }, [])
  
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
          {/* if edit button is clicked, do not show traits here! */}
          {!editChampId && <>
              {Object.keys(addTraits).length !== 0 && <div>Traits</div>}
              {Object.keys(addTraits).length !== 0 && Object.keys(addTraits).map((trait,idx)=>(
                <div key={idx}>
                  <div>{trait} </div><div onClick={()=>deleteTrait(trait)}>delete</div> 
                </div>
              ))}
            </>
          }
          {/* {Object.entries(addTraits).map(([key,value]))} */}
          <button type="submit">Add New Champion</button>
        </form>

        {championUpdateMessage && championUpdateMessage}
      </div>
      {/* display all champion with cost and traits */}
      {displayChampions.length !== 0 && displayChampions.map((champ,idx)=>(
      <div key={idx}>
        {/* when user clicks edit button, field appears */}
        {editChampId === champ._id ? 
        <form ref={detectClickOtherThanEdit} onSubmit={e=>editChampionSubmit(e,champ._id)} key={champ._id}>
        {/* <form onSubmit={e=>editChampionSubmit(e,champ._id)} key={champ._id}> */}
          <label htmlFor="editName">Name</label>
            <input type="text" id="editName" name="editName" value={editName} placeholder={champ.name} onChange={(e)=>{setEditName(e.target.value)}} required />
          <label htmlFor="editCost">Cost</label>
            <input type="number" id="editCost" name="editCost" value={editCost} placeholder={champ.cost} onChange={(e)=>{setEditCost(e.target.value)}} required />
            {Object.keys(addTraits).length !== 0 && <div>Traits</div>}
              {Object.keys(addTraits).length !== 0 && Object.keys(addTraits).map((trait,idx)=>(
                <div key={idx}>
                  <div>{trait} </div><div onClick={()=>deleteTrait(trait)}>delete</div> 
                </div>
              ))}

          <button type="submit">edit</button>
        </form>
          : 
          <div key={champ._id}>name: {champ.name}, cost: {champ.cost} 
            {(champ.traits).length !== 0 && (champ.traits).map((trait,idx)=>(
              <div key={trait._id}>{trait.name}</div>
            ))}
            <button onClick={()=>editHandler(champ)}>edit</button>
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

export default AdminChampions