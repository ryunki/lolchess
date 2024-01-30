import React, { useState } from 'react'
import { useRecoilValue } from 'recoil'
import { userDeck, userInfo } from 'recoil/stateAtoms'
import '../css/Compositions.css'
const Compositions = ({getTraits, displayCompositions, displayactivation, setChampionSelectedList, setDisplayCompositions}) => {
const userRecoil = useRecoilValue(userInfo)
const deckRecoil = useRecoilValue(userDeck)
const [selectedComposition, setSelectedComposition] = useState('')
  // if user clicks on 'My Compositions' button
// show on/off
const displayCompositionsHandler = () =>{
  setDisplayCompositions(!displayCompositions)
}

// user clicks one composition from the list
const compositionSelectHandler = (comp, id) =>{
  // display the champion composition in the component
  setChampionSelectedList(comp)
  // delete activations if there are any
  displayactivation.current = {}
  // data manipulation for the 'dataForTraitsAndRecommendation' function
  Object.entries(getTraits).forEach(([trait,info])=>{
    displayactivation.current = {...displayactivation.current,
      [trait]: info.activation
    }
  })
  setSelectedComposition(id)
}

  return (
    <>
      {/* button for displaying compositions */}
      {/* if user is logged in */}
      {userRecoil && <>
      {/* if user has compositions saved */}
        {deckRecoil && <>
          <div className='buttons-wrapper-composition'onClick={()=>displayCompositionsHandler()}> My Compositions</div>
            {/* if user clicks My compositions button display list of compositions*/}
          
              {displayCompositions && <div className='compositions-container'>
                  {Object.values(deckRecoil).map((comp)=>(
                    <div className={`compositions ${ selectedComposition=== comp._id ? 'active' : null}`} key={comp._id} onClick={()=>compositionSelectHandler(comp.champions, comp._id)}>{comp.name}</div>
                    ))}
                </div>}
            
          </>
        }
      </>
    }</>
  )
}

export default Compositions