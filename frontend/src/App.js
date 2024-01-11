// @ts-nocheck

import CurrentChampion from './components/CurrentChampion';
import ChampionsList from './components/ChampionsList';
import SelectedChampions from './components/SelectedChampions';
import Traits from './components/Traits';
import { useState, useRef, useEffect } from 'react';
import { champs, synergy } from './constants';

function App() {
  // display selected champion -> [stores name, traits]
  const [displayClickedChampion, setDisplayClickedChampion] = useState([]);
  // state that stores selected list of champions -> {champ: [traits], champ2: [traits]}
  const [championSelectedList, setChampionSelectedList] = useState({});
  // display all the traits of selected champions
  const [showAllTraits, setShowAllTraits] = useState({});

  // when a champion is clicked
  const onClickHandler = (champ, event) => {
      findChampionTraits(champ);
  };

  // remove the selected champion from the list
  const removeHandler = (champ) => {
    setChampionSelectedList((prev) => {
      if(prev[champ]){
        const updatedList = {...prev}
        delete updatedList[champ]
        return updatedList
      }
    });
  }
  // find selected champion's traits
  const findChampionTraits = (champ) => {
    // this variable is to store the traits of selected champion (this resets for every click)
    var traits_for_selected_champion = [];
    // if selected champion already exists in the list then remove the champion
    if (championSelectedList[champ]){
      removeHandler(champ)
      // if selected champion does not exist in the list
    }else{
      // loop though the classes
      Object.keys(synergy.classes).forEach((clas) => {
        // look for selected champion in every class
        for (const name_of_champion of synergy.classes[clas].champs) {
          if (name_of_champion === champ) {
            // this will be stored in a state later
            traits_for_selected_champion.push(clas);
          }
        }
      });
      // loop though the origins
      Object.keys(synergy.origins).forEach((orig) => {
        for (const name_of_champion of synergy.origins[orig].champs) {
          // if the selected champion is found in the array of origins
          if (name_of_champion === champ) {
            // this will be stored in a state later
            traits_for_selected_champion.push(orig);
          }
        }
      });

      // a function for adding selected champions and traits to the list
      setChampionSelectedList(prev => {
        // if champion already exists in the list, do not add
        if (prev[champ]){
          return
        // if champion does not exist in the list, add the champion and its traits
        }else{
          prev[champ] = traits_for_selected_champion
          // console.log(prev.sort())
        }
        return prev
      })
    }
    // to display currently clicked champion
    setDisplayClickedChampion([
      champ, traits_for_selected_champion
    ]);
  };

  const refreshHandler = () =>{
    setDisplayClickedChampion([])
    setChampionSelectedList({})
    setShowAllTraits({})
  }

useEffect(()=>{
  const collectTraits = {}
  // console.log("displaySelectedChampion: ",displaySelectedChampion)
  Object.entries(championSelectedList).forEach(([key,value])=>{
    value.forEach(item =>{
      collectTraits[item] = (collectTraits[item] || null) + 1
    })
  })
  
  console.log(collectTraits)
  setShowAllTraits(collectTraits)
},[championSelectedList, displayClickedChampion])
// console.log(championSelectedList)
  return (
    <>
      {/* display all champions */}
      <ChampionsList
        champs={champs}
        onClickHandler={onClickHandler}
      />
      <button onClick={()=>refreshHandler()}>Refresh</button>
      {/* display currently selected champion */}
      <CurrentChampion
        displayClickedChampion={displayClickedChampion}
      />
      {/* display selected list of champions */}
      <SelectedChampions championSelectedList={championSelectedList} />
      {/* display traits of all selected champions */}
      <Traits showAllTraits={showAllTraits} />
    </>
  );
}

export default App;
