import axios from 'axios'
import { useEffect, useState } from 'react'

const AdminTraitsComponent = ({getTraits, addTrait}) => {
  // display traits
  const [displayTraits, setDisplayTraits] = useState([])
  // for detecting input field real time
  const [trait, setTrait] = useState('')
  const [activation, setActivation] = useState('')
  // for saving activation number after hitting enter
  const [activationList, setActivationList] = useState([])
  // display message after each api call
  const [traitUpdateMessage, setTraitUpdateMessage] = useState('')
  // for displaying updated traits after deleting one
  const [rerender, setRerender] = useState(false)


  const deleteTraitHandler = async (id) =>{
    await axios.delete(`/api/admin/trait/${id}`).then(res=>{
      const message = res.data
      if (message === 'Trait removed'){
        setTraitUpdateMessage(message)
        // need this state. in case a user deletes twice in a row (state won't change. won't re-render)
        setRerender(!rerender)
      }
    }).catch(error=>{
      console.log(error.response.data)
    })
  }
// when user clicks submit button
  const addNewTraitSubmit = (e) =>{
    if(activationList.length !== 0){
      // api call for adding trait
      addTrait(trait, activationList).then(trait=>{
        // to trigger re-render after adding new trait
        setDisplayTraits(prevTraits => ({...prevTraits, [Object.keys(prevTraits).length]:trait.traitCreated}));
        setTraitUpdateMessage(trait.success)
      }).catch(error=>{
        // console.log(error.response.data)
        setTraitUpdateMessage(error.response.data)
      })
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
    console.log('use Effect')
    getTraits().then(res=>{
      setDisplayTraits(res.traits)
    }).catch(error=>{
      console.log(error)
    })
  }, [rerender])

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
      {traitUpdateMessage && traitUpdateMessage}
      {displayTraits && 
        Object.values(displayTraits).map((item,idx)=>(
          <div key={item._id}>
            <div>name: {item.name}</div>
            <div>activation: [{item.activation.length > 0 ? item.activation.join(',') : item.activation}]</div>
            <button onClick={()=>deleteTraitHandler(item._id)}>delete</button>
          </div>
      ))}
    </>
  )
}

export default AdminTraitsComponent