import axios from 'axios'
import { useEffect, useState } from 'react'
import {  useSetRecoilState, useRecoilValue } from 'recoil'
import { userInfo,logoutSelector } from '../../../recoil/stateAtoms';

import '../../../css/AdminPage.css'

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

  const {logout} = useRecoilValue(logoutSelector);
  const userRecoil = useSetRecoilState(userInfo)

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
    getTraits().then(res=>{
      setDisplayTraits(res.traits)
    }).catch(error=>{
      logout()
      userRecoil('')
      console.log(error)
    })
  }, [rerender])

  return (
    <div className="container">
      <div className="page-title">AdminTraits</div>
      <div className="input-container">
        <div className="input-wrapper">
          <label>Trait Name</label>
          <input type='text' id='trait' name='trait' value={trait} onChange={e=>setTrait(e.target.value)}/>
        </div>
        <div className="input-wrapper">
          <label>Activation</label>
          <input className="small" type='number' id='activation' name='activation' value={activation} onKeyDown={handleKeyDown} onChange={e=>setActivation(e.target.value)}/>
        </div>
        <div >
          <div className="display-button" onClick={()=>addNewTraitSubmit()}>Add</div>
        </div>
      </div>
      {trait && 
      <div className="display-input-data ">
        <div>{trait}</div>
          {activationList.length !== 0 && 
          <div className="added-trait-wrapper display-trait">
            <div className="display-button-delete" onClick={()=>deleteActivation()}>delete</div>
            <div className="display-trait">[ {activationList.join(', ')} ]</div>
          </div>
          }
      </div>
      }
        {traitUpdateMessage && 
          <div className="display-updated-message">
            {traitUpdateMessage}
          </div>
        }
        {Object.keys(displayTraits).length !== 0 && 
        <div className="traits-container-trait-page">
          {Object.values(displayTraits).map((item,idx)=>(
            <div className="input-container-display-champions"key={item._id}>
              <div>{item.name}</div>
              <div className="display-trait">[ {item.activation.length > 0 ? item.activation.join(', ') : item.activation} ]</div>
              <div className="display-button-delete" onClick={()=>deleteTraitHandler(item._id)}>delete</div>
            </div>
          ))}
        </div>
        }
    </div>
  )
}

export default AdminTraitsComponent