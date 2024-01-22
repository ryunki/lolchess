// @ts-nocheck

import CurrentChampion from './components/CurrentChampion';
import ChampionsList from './components/ChampionsList';
import SelectedChampions from './components/SelectedChampions';
import Recommendation from './components/Recommendation';
import Traits from './components/Traits';
import { useState, useRef, useEffect, useCallback } from 'react';
import { champs, synergy } from './constants';
import {specialFunctionAkali, sortTraits, dataForTraitsAndRecommendation } from './functions'

import './css/ChampionsList.css';
import './css/style.css';

function App() {
  // display selected champion -> [stores name, traits]
  const [displayClickedChampion, setDisplayClickedChampion] = useState([]);
  // state that stores selected list of champions -> {champ: [traits], champ2: [traits]}
  const [championSelectedList, setChampionSelectedList] = useState({});
  // for changing color of selected champion
  const [selectedChampion, setSelectedChampion] = useState([]);
  // showing all extra trait list
  const [displayExtraTraits, setDisplayExtraTraits] = useState({'switch': false, 'traits':{}})
  // selecting extra trait
  const [selectedTrait, setSelectedTrait] = useState({})

  // display activation indicator corresponding to its trait
  let displayactivation = useRef({})
  // for saving info for comparison
  let traitHistory = useRef({'k/da': [false, 0], 'true damage': [false, 0]})

  // just a variable that saves results to display traits
  let showAllTraits = {}
  // accumulating traits info
  let saveTraits = useRef({})
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
        setSelectedTrait({})
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
    // delete all the selected extra traits
    setSelectedTrait({})
    // delete all the saved traits and their activation indicators
    displayactivation.current = {}
    // delete trait history for comparison (Akali)
    traitHistory.current = {'k/da': [false, 0], 'true damage': [false, 0]}
    // deleted accumulated traits
    saveTraits.current = {}

  };

const saveHandler = (list) => {
  const jsonString = JSON.stringify(list)
  localStorage.setItem('Champions List', jsonString)
}

// when user clicks 'add trait' button
const addTraitHandler = () =>{
  let synergies = {}
  Object.keys(synergy).forEach(type=>{
    Object.entries(synergy[type]).forEach(([trait,value])=>{
      if (value.activation.length !== 1){
        synergies[trait] = [1, value.activation]
      }
    })
  })
  setDisplayExtraTraits({
    'switch': !displayExtraTraits.switch,
    'trait': synergies
  })
}

showAllTraits = dataForTraitsAndRecommendation(championSelectedList, displayactivation.current, traitHistory, selectedTrait, saveTraits)

return (
    <div className='background' style={{padding: '50px 10%'}} >
      {/* display all champions */}
      <ChampionsList onClickHandler={onClickHandler} selectedChampion={selectedChampion} costArray={costArray}
      />
      {Object.keys(championSelectedList).length !== 0 && 
        <>
        <div style={{ display: 'flex', justifyContent: 'center', margin:'1.5em'}}>
          <div className='reset' onClick={()=>saveHandler(championSelectedList)}>save</div> 
          <div className='reset' onClick={()=>refreshHandler()}>reset</div> 
          <div className='reset' onClick={()=>addTraitHandler()}>add trait</div> 
        </div>
        {displayExtraTraits.switch && Object.entries(displayExtraTraits.trait).map((trait,idx)=>(
            // this callBack function is to accumulate selected traits
            <div key={idx} onClick={()=>setSelectedTrait(prev => {
              return {
                ...prev,
                // if the trait value doesnt exist (null or undefined), return 0
                // { 'trait' : value, [activation indicator] } 
                [trait[0]]: [(prev[trait[0]]?.[0] ?? 0) + 1, trait[1][1]],
              }}
            )}> {trait[0]} </div>
        ))}
          
          <div className='contents-container'>
          {/* display currently selected champion */}
          <CurrentChampion displayClickedChampion={displayClickedChampion} costArray={costArray}/>
          {/* display selected list of champions */}
          <SelectedChampions championSelectedList={championSelectedList} refreshHandler={refreshHandler} costArray={costArray} onClickHandler={onClickHandler}/>
          </div>
          {/* display traits of all selected champions */}
          <div className='contents-container'>
            {Object.keys(showAllTraits[0]).length !== 0 && <Traits showAllTraits={showAllTraits[0]} />}
            
          </div>
            <Recommendation recommendChamp={showAllTraits[1]} championSelectedList={championSelectedList} costArray={costArray}/>
        </>
      }
        
    </div>
  );
}

export default App;
