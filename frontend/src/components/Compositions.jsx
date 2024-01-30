import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { userDeck, userInfo } from 'recoil/stateAtoms';
import '../css/Compositions.css';
import axios from 'axios';
const Compositions = ({
  getTraits,
  displayCompositions,
  displayactivation,
  setChampionSelectedList,
  setDisplayCompositions,
  setSelectedTrait,
  selectedComposition,
  setSelectedComposition,
  setSelectedChampion,
  retrieveCompositions,
  setRetrieveCompositions,
  openModal
}) => {
  const userRecoil = useRecoilValue(userInfo);
  const deckRecoil = useRecoilValue(userDeck);

  // user clicks one composition from the list
  const compositionSelectHandler = (comp, id) => {
    // display the champion composition in the component
    setChampionSelectedList(comp);
    // delete activations if there are any
    displayactivation.current = {};
    // data manipulation for the 'dataForTraitsAndRecommendation' function
    Object.entries(getTraits).forEach(([trait, info]) => {
      displayactivation.current = {
        ...displayactivation.current,
        [trait]: info.activation,
      };
    });
    const filteredComp = deckRecoil.filter(
      (composition) => composition._id === id
    );
    if (filteredComp[0]['extraTraits']) {
      setSelectedTrait(filteredComp[0].extraTraits);
    }
    setSelectedComposition(id);
    const champs = Object.keys(comp).map((champ) => champ);
    setSelectedChampion(champs);
  };

// const deleteCompositionHandler = (id) =>{
//   setDeleteCompId(id)
//   deleteComposition()
// } 

const deleteCompositionHandler = async (id) =>{
  await axios.post(`/api/users/compositions/${id}`).then(res=>{
    setSelectedChampion([]);
    openModal(res.data)
    setRetrieveCompositions(!retrieveCompositions)
  }).catch(error=>{
    console.log(error)
  })
}

  return (
    <>
      {/* button for displaying compositions */}
      {/* if user is logged in */}
      {userRecoil && (
        <>
          {/* if user has compositions saved */}
          {Object.keys(deckRecoil).length !== 0 && (
            <>
              {/* if user clicks My compositions button display list of compositions*/}
              {displayCompositions && (
                <div className='compositions-container'>
                  {Object.values(deckRecoil).map((comp) => (
                    <div key={comp._id} className='composition-wrapper'>
                      <div className={`compositions ${selectedComposition === comp._id ? 'active' : null}`} onClick={() =>compositionSelectHandler(comp.champions, comp._id)}>
                        {comp.name} 
                      </div>
                      <label className={`font-white ${selectedComposition === comp._id ? 'delete-composition' : 'delete-composition-none'}`}onClick={()=>deleteCompositionHandler(comp._id)}>X</label>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </>
      )}
    </>
  );
};

export default Compositions;
