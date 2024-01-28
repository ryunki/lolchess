// @ts-nocheck
import CurrentChampion from '../components/CurrentChampion';
import ChampionsList from '../components/ChampionsList';
import SelectedChampions from '../components/SelectedChampions';
import Recommendation from '../components/Recommendation';
import Traits from '../components/Traits';

import { useState, useRef, useEffect} from 'react';

import {dataForTraitsAndRecommendation } from '../functions'

import '../css/ChampionsList.css';
import '../css/style.css';
import axios from 'axios';

const Home = () => {
  const [getTraits, setGetTraits] = useState({})
  const [getChampions, setGetChampions] = useState({})
 
  // display selected champion -> [stores name, traits]
  const [displayClickedChampion, setDisplayClickedChampion] = useState([]);
  // state that stores selected list of champions -> {champ: [traits], champ2: [traits]}
  const [championSelectedList, setChampionSelectedList] = useState({});
  // for changing color of selected champion
  const [selectedChampion, setSelectedChampion] = useState([]);
  // showing all extra trait list
  const [displayExtraTraits, setDisplayExtraTraits] = useState({switch: false, traits:{}})
  // selecting extra trait, accumulate selected traits
  const [selectedTrait, setSelectedTrait] = useState({})
  // just a variable that saves results to display traits
  let showAllTraits = {}
  // accumulating traits info
  let saveTraits = useRef({})
  // display activation indicator corresponding to its trait
  let displayactivation = useRef({})
  // for saving info for comparison (Akali season 10)
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

  useEffect(()=>{
    const getTraits = async () =>{
      await axios.get('/api/content/traits').then(res=>{
        let traits = []
        Object.values(res.data.traits).forEach((item,idx)=>{
          traits[item.name] = {activation: item.activation, champions: item.champions}
        })
        setGetTraits(traits)
      }).catch(error=>{
        console.log(error)
      }) 
    }
    getTraits()

  },[])
  useEffect(()=>{
    const getChampions = async () =>{
      await axios.get('/api/content/champions').then(res=>{
        setGetChampions(res.data.champions)
      }).catch(error=>{
        console.log(error)
      }) 
    }
    getChampions()
    console.log('useEffect Home')

  },[])

   // Function to find traits for the selected champion 
  const findTraits = (champ,selectedChampionTraits,activation) => {
        // go through array of champions in a trait
          Object.entries(getTraits).forEach(([trait,info])=>{
            Object.values(info.champions).forEach((champion)=>{
              // if champion is found then save the trait and activation indicator
              if(champion[0] === champ){
                selectedChampionTraits.push(trait);
                activation[trait] = info.activation;
              }
            })
          })
    };


  const onClickHandler = (champ) => {
    changeButtonColor(champ[0]);
    // this variable is to store the traits of selected champion (this resets for every click)
    let selectedChampionTraits = [];
    // to store the array of activation indicators to corresponding traits
    let activation = [];
    // // Find traits in classes
    // findTraits('classes', champ[0], selectedChampionTraits, activation);
    // // Find traits in origins
    // findTraits('origins', champ[0], selectedChampionTraits, activation);
    findTraits(champ[0], selectedChampionTraits, activation)
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

    const cham = getChampions.filter(item=> item.name.toLowerCase() === champ[0].toLowerCase())
 
    setDisplayClickedChampion([[cham[0].name,cham[0].cost], selectedChampionTraits]);
    };

  // remove the selected champion from the list
  const removeHandler = (champ) => {
    setChampionSelectedList((prev) => {
      // if clicked champion is the last one in the list
      if(Object.keys(prev).length === 1){
        setDisplayClickedChampion([])
        setSelectedTrait({})
        // extra trait box closed
        setDisplayExtraTraits(prev => ({...prev, switch: false}))
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
    // extra trait box closed
    setDisplayExtraTraits(prev => ({...prev, switch: false}))
    // delete all the saved traits and their activation indicators
    displayactivation.current = {}
    // delete trait history for comparison (Akali)
    traitHistory.current = {'k/da': [false, 0], 'true damage': [false, 0]}
    // deleted accumulated traits
    saveTraits.current = {}

  };

const saveHandler = (list) => {
  const jsonString = JSON.stringify(list)
  console.log(list)
  localStorage.setItem('Champions List', jsonString)
}

// when user clicks 'add trait' button, display extra traits to add
const showExtraTraitHandler = () =>{
  let synergies = {}
  Object.entries(getTraits).forEach(([trait,info])=>{
      if (info.activation.length !== 1){
        synergies[trait] = [1, info.activation]
      }
  })
  setDisplayExtraTraits({
    switch: !displayExtraTraits.switch,
    traits: synergies
  })
}
// add selected traits to synergy, this function is to accumulate selected traits
const addExtraTraitHandler = (trait) => {
  setSelectedTrait(prev => {
    return {
      ...prev,
      // if the trait value doesnt exist (null or undefined), return 0
      // { 'trait' : value, [activation indicator] } 
      [trait[0]]: [(prev[trait[0]]?.[0] ?? 0) + 1, trait[1][1]],
    }}
  )
}

const deleteExtraTraitsFromSynergy = () =>{
  // delete all the selected extra traits
  setSelectedTrait({})
}

showAllTraits = dataForTraitsAndRecommendation(championSelectedList, displayactivation.current, traitHistory, selectedTrait, saveTraits)
console.log('render home')
  return (
    <>
    <div className='background' style={{padding: '50px 10%'}} >
      {/* display all champions */}
      <ChampionsList onClickHandler={onClickHandler} selectedChampion={selectedChampion} costArray={costArray} getChampions={getChampions} />
      {Object.keys(championSelectedList).length !== 0 && 
        <>
        <div className='buttons-container'>
          <div className='buttons-wrapper' onClick={()=>saveHandler(championSelectedList)}>save</div> 
          <div className='buttons-wrapper' onClick={()=>refreshHandler()}>reset</div> 
          <div className='buttons-wrapper' onClick={()=>showExtraTraitHandler()}>{displayExtraTraits.switch ? 'Traits Close': 'Traits Open'}</div> 
          {/* button for deleting all the extra traits added */}
          {Object.keys(selectedTrait).length !== 0 && <div className='buttons-wrapper' onClick={()=>deleteExtraTraitsFromSynergy()}>delete extra traits</div>}
        </div>
        {/* button for display extra traits to add */}
          {displayExtraTraits.switch && 
            <div className='contents-container-extraTraits font-white'>
              {Object.entries(displayExtraTraits.traits).map((trait,idx)=>(
                <div style={{cursor: 'pointer'}}className='current-traits' key={idx} onClick={()=>addExtraTraitHandler(trait)}> {trait[0]} </div>
              ))}
            </div>
          }
          
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
            <Recommendation recommendChamp={showAllTraits[1]} championSelectedList={championSelectedList} costArray={costArray} getTraits={getTraits}/>
        </>
      }
        
    </div>
    </>
  )
}

export default Home