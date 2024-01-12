// @ts-nocheck

import CurrentChampion from './components/CurrentChampion';
import ChampionsList from './components/ChampionsList';
import SelectedChampions from './components/SelectedChampions';
import Recommendation from './components/Recommendation';
import Traits from './components/Traits';
import { useState, useEffect } from 'react';
import { champs, synergy } from './constants';

function App() {
  // display selected champion -> [stores name, traits]
  const [displayClickedChampion, setDisplayClickedChampion] = useState([]);
  // state that stores selected list of champions -> {champ: [traits], champ2: [traits]}
  const [championSelectedList, setChampionSelectedList] = useState({});
  // display all the traits of selected champions
  const [showAllTraits, setShowAllTraits] = useState({});
  // display activation indicator corresponding to its trait
  const [displayActivation, setDisplayActivation] = useState([])
  // display recommended champions for inactivated traits
  const [recommendChamp, setRecommendChamp] = useState({})
  // stores the inactivated traits with differences, and the selected champions list
  const [dataForRecommendation, setDataForRecommendation] = useState({})

  // when a champion is clicked
  const onClickHandler = (champ) => {
    // this variable is to store the traits of selected champion (this resets for every click)
    var traits_for_selected_champion = [];
    // to store the array of activation indicators to corresponding traits
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
        // if champion already exists in the list, do not add anything
        if (prev[champ]){
          return
        // if champion does not exist in the list, add the champion and its traits
        }else{
          prev[champ] = traits_for_selected_champion
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
    setDisplayClickedChampion([champ, traits_for_selected_champion]);
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

  const refreshHandler = () =>{
    // delete currently clicked champion
    setDisplayClickedChampion([])
    // delete displayed list of champions
    setChampionSelectedList({})
    // delete traits of selected champions
    setShowAllTraits({})
    // delete champs for recommendation
    setRecommendChamp({})
    setDataForRecommendation({})
    prev_kda = []
    prev_trueDamage = []
  }

// championSelectedList, displayClickedChampion, displayActivation
// this useEffect is for organizing traits from selected list of champions
useEffect(()=>{
  const collectTraits = {}
  // remove duplicate traits and add up those number of accumulated traits and sorting from high to low
  Object.values(championSelectedList).forEach((traits)=>{
    traits.forEach(trait =>{
      collectTraits[trait] = (collectTraits[trait] || null) + 1 
    })
  })
  // attach array of activation limits to corresponding traits for display
  Object.keys(collectTraits).forEach((trait)=>{
    if(displayActivation[trait]){
      collectTraits[trait] = [collectTraits[trait], displayActivation[trait]]
    }
  })
  // sort the traits in order, and bring inactivated traits list
  const [sortedData, traitDifferenceList] = sortTraits(collectTraits)
  
  // Convert back to object
  const sortedObject = Object.fromEntries(sortedData);
 
  // Update state with the sorted object to be displayed in Traits Component
  setShowAllTraits(sortedObject);
  if(Object.keys(championSelectedList).length !== 0){
    setDataForRecommendation(traitDifferenceList)
  }
},[championSelectedList, displayClickedChampion, displayActivation])

  return (
    <>
      {/* display all champions */}
      <ChampionsList
        champs={champs}
        onClickHandler={onClickHandler}
      />
      {/* <button onClick={()=>refreshHandler()}>Refresh</button> */}
      {/* display currently selected champion */}
      <CurrentChampion
        displayClickedChampion={displayClickedChampion}
      />
      {/* display selected list of champions */}
      <SelectedChampions championSelectedList={championSelectedList} refreshHandler={refreshHandler} />
      {/* display traits of all selected champions */}
      <Traits showAllTraits={showAllTraits} />
      {/* display recommended champions to activate traits */}
      <Recommendation dataForRecommendation={dataForRecommendation} championSelectedList={championSelectedList} recommendChamp={recommendChamp} setRecommendChamp={setRecommendChamp}/>
    </>
  );
}
var prev_kda = []
var prev_trueDamage = []
function sortTraits(collectTraits) {
  // to identify which trait is activated and inactivated for AKALI
  const akali = {kda:[false,0],trueDamage:[false,0]}
  // to store and group by the trait results by activated or inactivated
  const activatedCategories = [];
  const inactivatedCategories = [];

  Object.entries(collectTraits).forEach(([trait,value]) => {
    // check if the the current trait equals or greater than any number of the activation array 
    const activated = value[1].some((num) => {
      // if kda or trueDamage is activated then set it true and its trait 
      if(akali[trait] && value[0] >= num){
        akali[trait][0] = true
        akali[trait][1] = value[0]
      }
      return value[0] >= num
    });
    // group them by activated and inactivated
    if (activated) {
      activatedCategories.push([trait,value]);
    } else {
      inactivatedCategories.push([trait,value]);
    }
  });
 const activatedCat = Object.fromEntries(activatedCategories)
 const inactivatedCat = Object.fromEntries(inactivatedCategories)
  // if both traits are activated for AKALI
  if (akali.kda[0] && akali.trueDamage[0]){
    // compare the value, if they are equal
    if (akali.kda[1] === akali.trueDamage[1]){
      // then find out which trait was added last
      if(prev_kda < prev_trueDamage){
        // console.log(" kda was added lately so remove truedamage")
        activatedCat.trueDamage[0] += -1
      }
      if(prev_kda > prev_trueDamage){
        // console.log(" TD was added lately so remove kda")
        activatedCat.kda[0] += -1
      }
    }
    // if both are activated but KDA has higher value
    if(akali.kda[1] > akali.trueDamage[1]){
      activatedCat.trueDamage[0] += -1
      // console.log("deduct 1 activated trueDamage")
    }
    if(akali.kda[1] < akali.trueDamage[1]){
      activatedCat.kda[0] += -1
      // console.log("deduct 1 activated kda")
    }
  // if kda is activated only, deduct 1 from trueDamage
  }else if (akali.kda[0] && !akali.trueDamage[0]){
    // trueDamage may not exist at this point in inactivatedCategories
    if (inactivatedCat.trueDamage){
      // console.log("deduct 1 inactivated trueDamage")
      inactivatedCat.trueDamage[0] += -1
    }
    // if trueDamage is activated only, deduct 1 from kda
  }else if (akali.trueDamage[0] && !akali.kda[0]){
    // kda may not exist at this point in inactivatedCategories
    if(inactivatedCat.kda){
      // console.log("deduct 1 inactivated kda")
      inactivatedCat.kda[0] += -1
    }
  }
  // this variable is for saving inactivated traits and re-arrange them by diffence as a key and name of traits as value 
  const traitDifference = {}
  // Sort inactivated categories by least differences to smallest activation number by high to low
  const sortedInactivatedCategories = inactivatedCategories.sort((a, b) => {
    // a[0] is the name of trait
    // a[1][0] is the current value of trait
    // aa[1][1][0] is the first number of activation indicator array
    // calculate the differences needed to be activated
    const differenceA = Math.abs(a[1][0]  - a[1][1][0]);
    const differenceB = Math.abs(b[1][0]  - b[1][1][0]);
    // save the differences to corresponding name of trait
    traitDifference[a[0]] = differenceA
    traitDifference[b[0]] = differenceB

    // Sort by least differences from low to high
    if (differenceA !== differenceB) {
      return differenceA - differenceB;
    }
    // If differences are equal, sort values by high to low
    return b[1][0]- a[1][0];
  });
  // re-arrange the trait differences by {1:[name of traits], 2:[name of traits]}
  const traitDifferenceList = Object.entries(traitDifference).reduce((acc,[key,value])=>{
    if(!acc[value]){
      acc[value] = []
    }
    acc[value].push(key)
    return acc
  },{})
  
  // Sort activated categories by value from high to low
  const sortedActivatedCategories = activatedCategories.sort((a, b) => {
    // Prioritize categories with activation array length of 1 at the top
    if (a[1][1].length === 1 && b[1][1].length !== 1) {
      // put first item before the second item
      return -1;
    }
    if (b[1][1].length === 1 && a[1][1].length !== 1) {
      // put second item before the first item
      return 1;
    }
    // sort values by high to low
    return b[1][0] - a[1][0]
  });

  // Combine sorted activated and inactivated categories
  const sortedData = sortedActivatedCategories.concat(sortedInactivatedCategories);
  
  // save AKALI's trait values for comparison
  Object.entries(collectTraits).forEach(([trait,value]) =>{
    if (trait === "kda"){
      prev_kda = value[0]
    }
    if (trait === "trueDamage"){
      prev_trueDamage = value[0]
    }
  })
  return [sortedData, traitDifferenceList]
}
export default App;
