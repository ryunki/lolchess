// @ts-nocheck

import CurrentChampion from './components/CurrentChampion';
import ChampionsList from './components/ChampionsList';
import SelectedChampions from './components/SelectedChampions';
import Recommendation from './components/Recommendation';
import Traits from './components/Traits';
import { useState, useEffect } from 'react';
import { champs, synergy } from './constants';

import './css/ChampionsList.css';
import './css/style.css';

function App() {
  // display selected champion -> [stores name, traits]
  const [displayClickedChampion, setDisplayClickedChampion] = useState([]);
  // state that stores selected list of champions -> {champ: [traits], champ2: [traits]}
  const [championSelectedList, setChampionSelectedList] = useState({});
  // display all the traits of selected champions
  const [showAllTraits, setShowAllTraits] = useState({});
  // display activation indicator corresponding to its trait
  const [displayActivation, setDisplayActivation] = useState({});
  // display recommended champions for inactivated traits
  const [recommendChamp, setRecommendChamp] = useState({});
  // for changing color of selected champion
  const [selectedChampion, setSelectedChampion] = useState([]);

  const [prevAkali, setPrevAkali] = useState({ 'k/da': [false, 0], 'true damage': [false, 0] })

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
    return [selectedChampionTraits, activation];
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
    
    championSelectedList[champ[0]]
      ? // if selected champion already exists in the list, remove it
        removeHandler(champ[0])
      : // if selected champion does not exist in the list, Add selected champions and traits to the list
        setChampionSelectedList((prev) => ({
          ...prev,
          [champ[0]]: {
            'traits': selectedChampionTraits,
            'cost': champ[1]
        }}));
    // Array.from(championSelectedList[champ[0]])
    
    // Add new traits and their activation indicator to the previous traits
    setDisplayActivation((prev) => ({ ...prev, ...activation }));
    // to display currently clicked champion
    const cham = champs.filter(champs => champs[0]===champ[0])

    setDisplayClickedChampion([cham, selectedChampionTraits]);
  };

  // remove the selected champion from the list
  const removeHandler = (champ) => {
    // setDisplayClickedChampion([]);
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
    // delete traits of selected champions
    setShowAllTraits({});
    // delete champs for recommendation
    setRecommendChamp({});
    setSelectedChampion([]);
    setDisplayActivation({});
    setPrevAkali({ 'k/da': [false, 0], 'true damage': [false, 0] })
    // prev_kda = [];
    // prev_trueDamage = [];
  };

  // championSelectedList, displayClickedChampion, displayActivation
  // this useEffect is for organizing traits from selected list of champions
  useEffect(() => {
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
    const [sortedData, traitDifferenceList] = sortTraits(collectTraits);
    // Convert back to object
    const sortedObject = Object.fromEntries(sortedData);

    // Update with the sorted object to be displayed in Traits Component
    setShowAllTraits(sortedObject)

    // if there are champions in the list
    if (Object.keys(championSelectedList).length !== 0) {
      setRecommendChamp(traitDifferenceList);
    } else {
      // if the clicked champion is the last in selected champions list, remove recommended champ
      setRecommendChamp({});
    }

    function sortTraits(collectTraits) {
      const kda = 'k/da'
      const td = 'true damage'
      // to identify which trait is activated and inactivated for AKALI
      const updatedAkali = { 'k/da': [false, 0], 'true damage': [false, 0] };
      // let updatedAkali = prevAkali
      // to store and group by the trait results by activated or inactivated
      const activatedCategories = [];
      const inactivatedCategories = [];
      Object.entries(collectTraits).forEach(([trait, value]) => {
        // check if the the current trait equals or greater than any number of the activation array
        const activated = value[1].some((num) => {
          // if kda or trueDamage is activated then update it to be true and save the trait
          if ((trait === kda || trait === td) && value[0] >= num) {
            updatedAkali[trait][0] = true;
            updatedAkali[trait][1] = value[0];
          }
          return value[0] >= num;
        });
        // update previous values to be compared for the next time
       if (trait === kda || trait === td) {
         setPrevAkali(prev => {
            prev[trait][0] = updatedAkali[trait][0]
            prev[trait][1] = value[0]
           return prev}
           )
        }
        // group them by activated and inactivated
        activated ? activatedCategories.push([trait, value]) : inactivatedCategories.push([trait, value])
      });
      
      const activatedCat = Object.fromEntries(activatedCategories);
      const inactivatedCat = Object.fromEntries(inactivatedCategories);

      specialFunctionAkali(activatedCat,inactivatedCat,updatedAkali,prevAkali , kda,td)

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
        return item[1][1].some(num =>item[1][0] >= num)
        })
      // extract inactivated kda/trueDamage from sortedActivatedCategories
      const takeaway = sortedActivatedCategories.filter(item=>{
        if(item[1][1].length === 1) return false //for cost 5 champions
        return !item[1][1].some(num =>  item[1][0] >= num)
      })
    
      // Combine sorted activated and inactivated categories
      const sortedData = newSortedActivatedCategories.concat(sortedInactivatedCategories.concat(takeaway));
    return [sortedData, traitDifferenceList];
  }

  }, [championSelectedList, displayClickedChampion, displayActivation, prevAkali]);

function specialFunctionAkali (activatedCat,inactivatedCat,updatedAkali,prevAkali, kda,td) {
    // if both traits are activated for AKALI
    if (updatedAkali[kda][0] && updatedAkali[td][0]) {
      // compare the value, if they are equal
      if (updatedAkali[kda][1] === updatedAkali[td][1]) {
        // then find out which trait was added last
        // console.log(" kda was added lately so remove truedamage")
        if (prevAkali[kda][1] < prevAkali[td][1]) {
          activatedCat[td][0] += -1
        } 
          // console.log(" TD was added lately so remove kda")
        if (prevAkali[kda][1] > prevAkali[td][1]) {
          (activatedCat[kda][0] += -1)
        } 
      }
        // if both are activated but KDA has higher value
        // console.log("deduct 1 activated trueDamage")
        if (updatedAkali[kda][1] > updatedAkali[td][1]) {
          activatedCat[td][0] += -1
        }
          // console.log("deduct 1 activated kda")
        if (updatedAkali[kda][1] < updatedAkali[td][1]) {
          activatedCat[kda][0] += -1
        }
      
        // if kda is activated only, deduct 1 from trueDamage
    } else if (updatedAkali[kda][0] && !updatedAkali[td][0]) {
      // trueDamage may not exist at this point in inactivatedCategories
      if (inactivatedCat[td]) {
        inactivatedCat[td][0] += -1
      }
      // kda may not exist at this point in inactivatedCategories
    } else if (updatedAkali[td][0] && !updatedAkali[kda][0]) {
      if (inactivatedCat[kda]) {
        inactivatedCat[kda][0] += -1
      }
    }
  }

  return (
    <div className='background' style={{padding: '50px 10%'}} >
      {/* display all champions */}
      <ChampionsList onClickHandler={onClickHandler} selectedChampion={selectedChampion} costArray={costArray}
      />
      {/* <button onClick={()=>refreshHandler()}>Refresh</button> */}
      {Object.keys(championSelectedList).length !== 0 && 
        Object.keys(displayClickedChampion).length !== 0 && 
        Object.keys(showAllTraits).length !== 0 && 
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
        {Object.keys(recommendChamp).length !== 0 && 
          <Recommendation recommendChamp={recommendChamp} championSelectedList={championSelectedList} costArray={costArray}/>
        }
    </div>
  );
}

export default App;
