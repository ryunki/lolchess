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

  const [displayActivation, setDisplayActivation] = useState([])

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
    var activation = [];
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
            activation[clas] = synergy.classes[clas].activation
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
            activation[orig] = synergy.origins[orig].activation
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
          // prev[champ] = [traits_for_selected_champion, activation]
          prev[champ] = traits_for_selected_champion
          // console.log(prev.sort())
        }
        return prev
      })
      // add traits and its activation
      setDisplayActivation(prev => {
        Object.entries(activation).forEach(([key,value])=>{
          prev[key] = prev[key] || value
        })
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
    setDisplayActivation([])
  }
useEffect(()=>{
  const collectTraits = {}
  // for adding up accumulated traits and sorting from high to low
  Object.entries(championSelectedList).forEach(([key,value])=>{
    value.forEach(item =>{
      collectTraits[item] = (collectTraits[item] || null) + 1 
    })
  })
  // add activation limits to each traits
  Object.entries(collectTraits).forEach(([key,value])=>{
    if(displayActivation[key]){
      collectTraits[key] = [collectTraits[key], displayActivation[key]]
    }
  })
  // const entries = Object.entries(collectTraits);
  // // Sort the array by values
  // entries.sort((a, b) => b[1] - a[1]);
  // // Convert back to object
  // const sortedObject = Object.fromEntries(entries);
  // // Update state with the sorted object
  // setShowAllTraits(sortedObject);
  setShowAllTraits(collectTraits);

},[championSelectedList, displayClickedChampion,displayActivation])
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
