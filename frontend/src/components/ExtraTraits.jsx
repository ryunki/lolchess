// @ts-nocheck
import React, { useState } from 'react'
import '../css/style.css';
import '../css/traits.css';
const ExtraTraits = ({showExtraTraitHandler, selectedExtraTrait, displayExtraTraits, setSelectedExtraTrait, highlightTrait, setHighlightTrait}) => {

  // add selected traits to synergy, this function is to accumulate selected traits
const addExtraTraitHandler = (trait) => {
  setSelectedExtraTrait(prev => {
    return {
      ...prev,
      // if the trait value doesnt exist (null or undefined), return 0
      // { 'trait' : value, [activation indicator] } 
      [trait[0]]: [(prev[trait[0]]?.[0] ?? 0) + 1, trait[1][1]],
    }}
  )
  setHighlightTrait(prev =>{
    const hey = new Set([...prev, trait[0]])
    return Array.from(hey)
  })
}

const highlightSelected = (trait) =>{
    if(highlightTrait.includes(trait)){
      return 'active'
    }
}
const deleteExtraTraitsFromSynergy = () =>{
  // delete all the selected extra traits
  setSelectedExtraTrait({})
  setHighlightTrait([])
}
  
  return (<>
        <div className='buttons-container'>
          <div className='buttons-wrapper-trait font-white' onClick={()=>showExtraTraitHandler()}>{displayExtraTraits.switch ? 'Traits Close': 'Traits Open'}
          </div> 
          {/* button for deleting all the extra traits added */}
          {Object.keys(selectedExtraTrait).length !== 0 && 
          <div className='font-white display-button-delete' onClick={()=>deleteExtraTraitsFromSynergy()}>delete extra traits
          </div>}
        </div>
        
        {/* button for display extra traits to add */}
        
        {displayExtraTraits.switch && 
          <div className='contents-container-extraTraits font-white'>
          {Object.entries(displayExtraTraits.traits).map((trait,idx)=>(
            <div style={{cursor: 'pointer'}}className={`current-traits ${highlightSelected(trait[0])}`} key={idx} onClick={()=>addExtraTraitHandler(trait)}> {trait[0]} </div>
            ))}
            </div>
          }
        
    </>
  )
}

export default ExtraTraits