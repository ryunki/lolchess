// @ts-nocheck
import axios from "axios"
import { useEffect, useState } from "react"


const AdminTraits = () => {
  const [displayTraits, setDisplayTraits] = useState({})
  const [trait, setTrait] = useState('')
  const [activation, setActivation] = useState('')
  const [activationList, setActivationList] = useState([])


  const getTraits = async() =>{
    await axios.get('/api/admin/traits')
      .then(res=>{
        console.log(res.data.traits)
        setDisplayTraits(res.data.traits)
      }).catch(error=>{
        console.log(error.response.data)
      })
  }

  const addTrait = async (name, activation)=> {
    console.log(name, activation)
    await axios.post('/api/admin/trait',{ name, activation })
      .then(res=>{
        console.log(res.data)
        if (res.data.success === 'Trait created'){
          const data = res.data.success.traitCreated
          setDisplayTraits(data)
        }
      }).catch(error=>{
        console.log(error.response.data)
      })
  }
// when user clicks submit button
  const addNewTraitSubmit = async (e) =>{
    console.log(trait, activationList,activation)
    if(activationList.length !== 0){
      // api call for adding trait
      addTrait(trait, activationList)
      // empty all the input fields after submit
      setActivationList([])
      setTrait('')
      setActivation('')
    }else if(activation){
      // user did not hit enter after filling in activation field
      console.log('activation something',activation)
    }else{
      // user did not fill in activation field
      console.log('activation length 0 nothing',activation)
    }
  }

  // Handle Enter key press for activation
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      setActivation('')
      setActivationList([...activationList, parseInt(e.target.value)])
    }
  }
  const deleteActivation = () => {
    setActivationList([])
  }

  useEffect(() => {
    getTraits()
  }, [trait])

  return (
    <>
      <div>AdminTraits</div>
      <div>
        <label>Trait Name</label>
        <input type='text' id='trait' name='trait' value={trait} onChange={e=>setTrait(e.target.value)}/>
        <label>Activation</label>
        <input type='number' id='activation' name='activation' value={activation} onKeyDown={handleKeyDown} onChange={e=>setActivation(e.target.value)}/>
        <button onClick={addNewTraitSubmit}>Submit</button>
        <div>Entered trait name:</div>
        <div>{trait}</div>
          {activationList.length !== 0 && 
          <>
            <div>Entered activation:</div><div onClick={()=>deleteActivation()}>delete</div>
            <div>[{activationList.join(',')}]</div>
          </>
        }
      </div>

      {displayTraits && 
        Object.values(displayTraits).map((item,idx)=>(
        <div key={idx}>
          <div>name: {item.name}</div>
          <div>activation: [{item.activation.join(',')}]</div>
        </div>
      ))}
    </>
  )
}

export default AdminTraits