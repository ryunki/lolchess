// @ts-nocheck

import CurrentChampion from './components/CurrentChampion';
import ChampionsList from './components/ChampionsList';
import SelectedChampions from './components/SelectedChampions';
import Recommendation from './components/Recommendation';
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
  // display trait and its activation numbers
  const [displayActivation, setDisplayActivation] = useState([])
  // // display recommended champions for inactivated traits
  // const [recommendChamp, setRecommendChamp] = useState({})
  // stores the inactivated traits with differences, and the selected champions list
  const [dataForRecommendation, setDataForRecommendation] = useState()

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
    prev_kda = []
    prev_trueDamage = []
  }

useEffect(()=>{
  const collectTraits = {}
  // for adding up number of accumulated traits and sorting from high to low
  Object.entries(championSelectedList).forEach(([key,value])=>{
    value.forEach(item =>{
      collectTraits[item] = (collectTraits[item] || null) + 1 
    })
  })
  // add array of activation limits to each traits for display
  Object.entries(collectTraits).forEach(([key,value])=>{
    if(displayActivation[key]){
      collectTraits[key] = [collectTraits[key], displayActivation[key]]
    }
  })
  // sort the traits in order, and bring inactivated traits list
  const [sortedData, traitDifferenceList] = sortTraits(collectTraits)
  
  // Convert back to object
  const sortedObject = Object.fromEntries(sortedData);
 
  // // Update state with the sorted object
  setShowAllTraits(sortedObject);
  // setShowAllTraits(collectTraits);
  // console.log(championSelectedList)
  // console.log(collectTraits)
  // console.log(traitDifferenceList)
  if(Object.keys(championSelectedList).length !== 0){
    setDataForRecommendation([championSelectedList, traitDifferenceList])
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

      <Recommendation dataForRecommendation={dataForRecommendation}/>
    </>
  );
}
var prev_kda = []
var prev_trueDamage = []
function sortTraits(collectTraits) {
  const sort = Object.entries(collectTraits);
  const activatedCategories = [];
  const inactivatedCategories = [];
  const akali = {kda:[false,0],trueDamage:[false,0]}
  sort.forEach((item) => {
    // check if the the current trait equals or greater than any number of the activation array 
    const activated = item[1][1].some((num) => {
      // if kda or trueDamage is activated then set it true and its trait 
      if(akali[item[0]] && item[1][0] >= num){
        akali[item[0]][0] = true
        akali[item[0]][1] = item[1][0]
      }
      return item[1][0] >= num
    });
    // group them by activated and inactivated
    if (activated) {
      activatedCategories.push(item);
    } else {
      inactivatedCategories.push(item);
    }
  });
  // console.log("sort: ",sort)
  // console.log("prev_kda and TD: ", prev_kda,prev_trueDamage)
  // console.log("akali kda: ", akali.kda)
  // console.log("akali TD: ", akali.trueDamage)
  // if(sort)
  // if both traits are activated
  if (akali.kda[0] && akali.trueDamage[0]){
    if (akali.kda[1] === akali.trueDamage[1]){
      if(prev_kda < prev_trueDamage){
        console.log(" kda was added lately so remove truedamage")
        Object.fromEntries(activatedCategories).trueDamage[0] += -1
      }
      if(prev_kda > prev_trueDamage){
        console.log(" TD was added lately so remove kda")
        Object.fromEntries(activatedCategories).kda[0] += -1
      }
    }
    // prev_kda = []
    // prev_trueDamage = []
    if(akali.kda[1] > akali.trueDamage[1]){
      Object.fromEntries(activatedCategories).trueDamage[0] += -1
      console.log("deduct 1 trueDamage first")
    }
    if(akali.kda[1] < akali.trueDamage[1]){
      Object.fromEntries(activatedCategories).kda[0] += -1
      console.log("deduct 1 kda first")
    }
    // if kda is activated only, deduct 1 from trueDamage
  }else if (akali.kda[0] && !akali.trueDamage[0]){
    console.log("deduct 1 trueDamage second")
    // trueDamage may not exist at this point
    if (Object.fromEntries(inactivatedCategories).trueDamage){
      Object.fromEntries(inactivatedCategories).trueDamage[0] += -1
    }
    // if trueDamage is activated only, deduct 1 from kda
  }else if (akali.trueDamage[0] && !akali.kda[0]){
    console.log("deduct 1 kda second")
    // kda may not exist at this point
    if(Object.fromEntries(inactivatedCategories).kda){
      Object.fromEntries(inactivatedCategories).kda[0] += -1
    }
  }
  // this variable is for saving inactivated traits and re-arrange them by diffence as a key and name of traits as value 
  const traitDifference = {}
  // Sort inactivated categories by least differences to smallest activation number by high to low
  const sortedInactivatedCategories = inactivatedCategories.sort((a, b) => {
    const differenceA = Math.abs(a[1][0]  - a[1][1][0]);
    const differenceB = Math.abs(b[1][0]  - b[1][1][0]);
    // save the differences
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
  // console.log(groupedData)
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
  
  sort.forEach((item,idx) =>{
    if (item[0] === "kda"){
      // prev_kda.push(item[1][0])
      prev_kda =  item[1][0]
    }
    if (item[0] === "trueDamage"){
      // prev_trueDamage.push(item[1][0])
      prev_trueDamage=item[1][0]
    }
  })
  return [sortedData, traitDifferenceList]
}
export default App;
