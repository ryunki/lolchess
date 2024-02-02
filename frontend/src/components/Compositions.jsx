import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { userDeck, userInfo } from 'recoil/stateAtoms';
import '../css/Compositions.css';
import axios from 'axios';
const Compositions = ({
  displayTraits,
  displayCompositions,
  displayactivation,
  setChampionSelectedList,
  setSelectedExtraTrait,
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
    // empty extraTraits state for display. otherwise this is going to be added to all other compositions selected
    setSelectedExtraTrait('')
    // display the champion composition in the component
    setChampionSelectedList(comp);
    // delete activations if there are any
    displayactivation.current = {};
    // data manipulation for the 'dataForTraitsAndRecommendation' function
    Object.entries(displayTraits).forEach(([trait, info]) => {
      displayactivation.current = {
        ...displayactivation.current,
        [info.name]: info.activation,
      };
    });
    const filteredComp = deckRecoil.filter(
      (composition) => composition._id === id
    );
    if (filteredComp[0]['extraTraits']) {
      setSelectedExtraTrait(filteredComp[0].extraTraits);
    }
    setSelectedComposition(id);
    const champs = Object.keys(comp).map((champ) => champ);
    setSelectedChampion(champs);
  };

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
        <>
          {/* if user is logged in and if user has compositions saved */}
          {userRecoil&& Object.keys(deckRecoil).length !== 0 && (
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
    </>
  );
};

export default Compositions;
