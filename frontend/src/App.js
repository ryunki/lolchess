// @ts-nocheck

import CurrentChampion from './components/CurrentChampion';
import ChampionsList from './components/ChampionsList';
import SelectedChampions from './components/SelectedChampions';
import Recommendation from './components/Recommendation';
import Traits from './components/Traits';
import { useState, useRef } from 'react';
import { champs, synergy } from './constants';

import './css/ChampionsList.css';
import './css/style.css';

function App() {
  // display selected champion -> [stores name, traits]
  const [displayClickedChampion, setDisplayClickedChampion] = useState([]);
  // state that stores selected list of champions -> {champ: [traits], champ2: [traits]}
  const [championSelectedList, setChampionSelectedList] = useState({});
  // for changing color of selected champion
  const [selectedChampion, setSelectedChampion] = useState([]);
  // display activation indicator corresponding to its trait
  let displayactivation = useRef({})
  // for saving info for comparison
  let traitHistory = useRef({'k/da': [false, 0], 'true damage': [false, 0]})

  // champion's cost array for displaying color
  const costArray = ['', 'one', 'two', 'three', 'four', 'five'];

  const changeButtonColor = (champ) => {
    setSelectedChampion((prev) =>
      prev.includes(champ)
        ? prev.filter((item) => item !== champ)
        : [...prev, champ]
    );
  };

  // Function to find traits for the selected champion in a given synergy type
  const findTraits = (synergyType,champ,selectedChampionTraits,activation) => {
    // look for selected champion in every trait
    Object.keys(synergy[synergyType]).forEach((type) => {
      // for every trait
      const trait = synergy[synergyType][type]
      // go through array of champions in a trait
        trait.champs.forEach((item, idx)=>{
          // if champion is found then save the trait and activation indicator
          if(item[0] === champ){
            selectedChampionTraits.push(type);
            activation[type] = trait.activation;
          }
        })
    });
    // return [selectedChampionTraits, activation];
  };


  const onClickHandler = (champ) => {
    changeButtonColor(champ[0]);
    // this variable is to store the traits of selected champion (this resets for every click)
    let selectedChampionTraits = [];
    // to store the array of activation indicators to corresponding traits
    let activation = [];
    // Find traits in classes
    findTraits('classes', champ[0], selectedChampionTraits, activation);
    // Find traits in origins
    findTraits('origins', champ[0], selectedChampionTraits, activation);
  
    if(championSelectedList[champ[0]]){
      // if selected champion already exists in the list, remove it
      removeHandler(champ[0])
    }else{
      // if selected champion does not exist in the list, Add selected champions and traits to the list
      setChampionSelectedList((prev) => ({
         ...prev,
         [champ[0]]: {
           'traits': selectedChampionTraits,
           'cost': champ[1]
       }}));
    }

    // Add new traits and their activation indicator to the previous traits
    displayactivation.current = {...displayactivation.current, ...activation}

    // to display currently clicked champion
    const cham = champs.filter(champs => champs[0]===champ[0])

    setDisplayClickedChampion([cham, selectedChampionTraits]);
   };

  // remove the selected champion from the list
  const removeHandler = (champ) => {
 
    setChampionSelectedList((prev) => {
      // if clicked champion is the last one in the list
      if(Object.keys(prev).length === 1){
        setDisplayClickedChampion([])
      }
      if (prev[champ]) {
        const updatedList = { ...prev };
        delete updatedList[champ];
        return updatedList;
      }
      return prev;
    });
  };

  const refreshHandler = () => {
    // delete currently clicked champion
    setDisplayClickedChampion([]);
    // delete displayed list of champions
    setChampionSelectedList({});
    // delete selected champion
    setSelectedChampion([]);
    // delete all the saved traits and their activation indicators
    displayactivation.current = {}
    traitHistory.current = {'k/da': [false, 0], 'true damage': [false, 0]}
  };

  const sortTraits = (collectTraits, championSelectedList ) => {
  
    let kda = 'k/da'
    let td = 'true damage'
    // to store and group by the trait results by activated or inactivated
    let activatedCategories = [];
    let inactivatedCategories = [];

    let currentAkali = { 'k/da': [false, 0], 'true damage': [false, 0] }

    Object.entries(collectTraits).forEach(([trait, value]) => {
 
      // check if the the current trait equals or greater than any number of the activation array
      const activated = value[1].some((num) => {
        // update kda or trueDamage's current state
        if (trait === kda || trait === td) {
          if (value[0] >= num){
            currentAkali[trait][0] = true;
            currentAkali[trait][1] = value[0];
          }else{
            currentAkali[trait][0] = false;
            currentAkali[trait][1] = value[0];
          }
        }
        return value[0] >= num;
      });
     
      // group them by activated and inactivated
      activated ? activatedCategories.push([trait, value]) : inactivatedCategories.push([trait, value])
    });
    
    let activatedCat = Object.fromEntries(activatedCategories);
    let inactivatedCat = Object.fromEntries(inactivatedCategories);
    // extract inactivated trait for akali
    const inActivated = Object.keys(currentAkali).filter((trait) => currentAkali[trait][0] === false)
    // const activated = Object.keys(currentAkali).filter((trait) => currentAkali[trait][0] === true)
    const sameValue = currentAkali[kda][1] === currentAkali[td][1]
    const kdaIsLower = currentAkali[kda][1] < currentAkali[td][1]
    // if the list includes Akali
    if(championSelectedList['Akali']){
      // eslint-disable-next-line no-sequences
      specialFunctionAkali()
    }else{
      // if both values are different
      if (!sameValue){
        // if both traits are inactivated
        if(inActivated.length === 2){
          // update trait history
          Object.entries(traitHistory.current).forEach(([trait,value])=>{
            inactivatedCat[trait] && (traitHistory.current[trait][1] = inactivatedCat[trait][0])
          })
        }
    }
  }
    // update inactivated categories
    inactivatedCategories = Object.entries(inactivatedCat)
// filter inactivated trait
    const filteredTraitFromAct = Object.entries(activatedCat).filter(item => item[1][0] < item[1][1][0])
    // if inactivated trait exists in activatedCategories, move it to inactivatedCategories
    // this happens because of AKALI's special logic for deducting traits
    if(filteredTraitFromAct.length !== 0){
      const filteredTraitFromActCorrect = Object.entries(activatedCat).filter(item => item[1][0] >= item[1][1][0])
      activatedCategories = filteredTraitFromActCorrect
      inactivatedCategories = [...inactivatedCategories, filteredTraitFromAct[0]]
    }
    // this variable is for saving inactivated traits and re-arrange them by diffence as {difference: [trait, trait2...]}
    let traitDifference = {};
    let sortedInactivatedCategories = [];
    if (inactivatedCategories.length > 1) {
      // Sort inactivated categories by differences by low to high
      // array( ['trait1',[1, [2,4,6,8]]], ['trait2',[1, [2,4,6,8]]] )
      sortedInactivatedCategories = inactivatedCategories.sort((a, b) => {
        // a[0] is the name of trait
        // a[1][0] is the current value of trait
        // aa[1][1][0] is the first number of activation indicator array
        // calculate the differences needed to be activated
        const differenceA = Math.abs(a[1][0] - a[1][1][0]);
        const differenceB = Math.abs(b[1][0] - b[1][1][0]);
        // save the differences to corresponding name of trait
        traitDifference[a[0]] = differenceA;
        traitDifference[b[0]] = differenceB;
        // If differences are not equal, Sort by least differences from low to high
        if (differenceA !== differenceB) {
          return differenceA - differenceB;
        }
        // If differences are equal, sort values by high to low
        return b[1][0] - a[1][0];
      });
      // because sort() won't work with length of 1
    } else if (inactivatedCategories.length === 1) {
      const cat = inactivatedCategories[0];
      const difference = Math.abs(cat[1][0] - cat[1][1][0]);
      traitDifference[cat[0]] = difference;
      sortedInactivatedCategories = inactivatedCategories;
    }
    
    // from {trait: 1, trait2: 1, trait3: 2 ...}
    // re-arrange the trait differences to {1:[name of traits], 2:[name of traits]}

    const traitDifferenceList = Object.entries(traitDifference).reduce(
      (acc, [key, value]) => {
          if (!acc[value]) {acc[value] = [];}
          acc[value].push(key);
        return acc;
      },{});
      // Sort activated categories by value from high to low
    const sortedActivatedCategories = activatedCategories.sort((a, b) => {
      // Prioritize categories with activation array length of 1 at the top (for 5 cost champion's synergy)
      if (a[1][1].length === 1 && b[1][1].length !== 1) return -1 // put first item before the second item
      if (b[1][1].length === 1 && a[1][1].length !== 1) return  1  // put second item before the first item
      return (b[1][0] - a[1][0]) // sort values by high to low
  });

    // refilter because there is a case where kda/trueDamage is inactivated but included in activatedCategories
    // filter out inactivated kda/trueDamage from  sortedActivatedCategories

    const newSortedActivatedCategories = sortedActivatedCategories.filter(item=>{
      if(item[1][1].length === 1) return true //for cost 5 champions
        return item[1][1].some(num => {return item[1][0] >= num})
      })
    // extract inactivated kda/trueDamage from sortedActivatedCategories
    const takeaway = sortedActivatedCategories.filter(item=>{
      if(item[1][1].length === 1) return false //for cost 5 champions
        return !item[1][1].some(num =>  item[1][0] >= num)
    })
    
    // Combine sorted activated and inactivated categories
    const sortedData = newSortedActivatedCategories.concat(sortedInactivatedCategories.concat(takeaway));
  
    return [sortedData, traitDifferenceList];
    
    function specialFunctionAkali () {
      // if both traits have same value
      if(sameValue){
        // if one trait is activated only
        if(inActivated.length === 1){
          // deduct 1 from inactivated trait
          inactivatedCat[inActivated][0] += -1
          // update trait history
          Object.entries(traitHistory.current).forEach(([trait,value])=>{
            inactivatedCat[trait] && (traitHistory.current[trait][1] = inactivatedCat[trait][0])
          })
        }
        // if both traits are activated
        else if(inActivated.length === 0){
          // compare history value
          // traitHistory
          if(traitHistory.current[kda] < traitHistory.current[td]){
            // it means kda was add in the last time, deduct 1 from td
            activatedCat[td][0] += -1
          }
          if(traitHistory.current[kda] > traitHistory.current[td]){
            // it means kda was add in the last time, deduct 1 from td
            activatedCat[kda][0] += -1
          }
          // update trait history
          Object.entries(traitHistory.current).forEach(([trait,value])=>{
            activatedCat[trait] && (traitHistory.current[trait][1] = activatedCat[trait][0])
          })
        }
      }
      // if both traits have different value
      else {
        // if one trait is activated only
        if(inActivated.length === 1){
          // deduct 1 from inactivated trait
          inactivatedCat[inActivated][0] += -1
        }
        // if both traits are activated
        else if(inActivated.length === 0){
          // deduct 1 from lower valued trait
           kdaIsLower ?activatedCat[kda][0] += -1 : activatedCat[td][0] += -1
        }
        // update trait history
        Object.entries(traitHistory.current).forEach(([trait,value])=>{
          activatedCat[trait] && (traitHistory.current[trait][1] = activatedCat[trait][0])
        })
      }
    }
}

  const dataForTraitsAndRecommendation = (championSelectedList, displayActivation) => {

    const collectTraits = {};
      // remove duplicate traits and add up those number of accumulated traits and sorting from high to low
      Object.values(championSelectedList).forEach((champ) => {
        champ.traits.forEach((trait) => {
          collectTraits[trait] = (collectTraits[trait] || null) + 1;
        });
      });
      // attach array of activation indicator to corresponding traits
      Object.keys(collectTraits).forEach((trait) => {
        if (displayActivation[trait]) {
          collectTraits[trait] = [collectTraits[trait], displayActivation[trait]];
        }
      });
      // sort the traits in order, and get inactivated traits list
      const [sortedData, traitDifferenceList] = sortTraits(collectTraits, championSelectedList);
      // Convert back to object
      const sortedObject = Object.fromEntries(sortedData);
 
      return [sortedObject, traitDifferenceList]
}

// const [showAllTraits, traitDifferenceList] = dataForTraitsAndRecommendation(championSelectedList, displayActivation)
const [showAllTraits, traitDifferenceList] = dataForTraitsAndRecommendation(championSelectedList, displayactivation.current)


  return (
    <div className='background' style={{padding: '50px 10%'}} >
      {/* <button onClick={()=>testFunction(testValue)}>{testValue}</button> */}
      {/* display all champions */}
      <ChampionsList onClickHandler={onClickHandler} selectedChampion={selectedChampion} costArray={costArray}
      />
      {/* <button onClick={()=>refreshHandler()}>Refresh</button> */}
      {Object.keys(championSelectedList).length !== 0 && 
        Object.keys(displayClickedChampion).length !== 0 && 
        <>
        <div style={{ display: 'flex', justifyContent: 'center', margin:'1.5em'}}>
          <div className='reset' onClick={()=>refreshHandler()}>reset</div> 
        </div>
          
          <div className='contents-container'>
          {/* display currently selected champion */}
          <CurrentChampion displayClickedChampion={displayClickedChampion} costArray={costArray}/>
          {/* display selected list of champions */}
          <SelectedChampions championSelectedList={championSelectedList} refreshHandler={refreshHandler} costArray={costArray} onClickHandler={onClickHandler}/>
          </div>
          {/* display traits of all selected champions */}
          <div className='contents-container'>
            <Traits showAllTraits={showAllTraits} />
          </div>
        </>
      }
        {/* display recommended champions to activate traits */}
        {Object.keys(traitDifferenceList).length !== 0 && 
          <Recommendation recommendChamp={traitDifferenceList} championSelectedList={championSelectedList} costArray={costArray}/>
        }
    </div>
  );
}

export default App;
