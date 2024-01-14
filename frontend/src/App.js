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
  const [displayActivation, setDisplayActivation] = useState({});
  // display recommended champions for inactivated traits
  const [recommendChamp, setRecommendChamp] = useState({});
  // for changing color of selected champion
  const [selectedChampion, setSelectedChampion] = useState([]);

  const [prevAkali, setPrevAkali] = useState({ kda: [false, 0], trueDamage: [false, 0] })

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

  const onClickHandler = (champ, idx) => {
    changeButtonColor(champ);
    // this variable is to store the traits of selected champion (this resets for every click)
    let selectedChampionTraits = [];
    // to store the array of activation indicators to corresponding traits
    let activation = [];
    // Find traits in classes
    findTraits('classes', champ, selectedChampionTraits, activation);
    // Find traits in origins
    findTraits('origins', champ, selectedChampionTraits, activation);

    championSelectedList[champ]
      ? // if selected champion already exists in the list, remove it
        removeHandler(champ)
      : // if selected champion does not exist in the list, Add selected champions and traits to the list
        setChampionSelectedList((prev) => ({
          ...prev,
          [champ]: selectedChampionTraits,
        }));
    // Add new traits and their activation indicator to the previous traits
    setDisplayActivation((prev) => ({ ...prev, ...activation }));
    // to display currently clicked champion
    setDisplayClickedChampion([champ, selectedChampionTraits]);
  };

  // remove the selected champion from the list
  const removeHandler = (champ) => {
    setChampionSelectedList((prev) => {
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
    setPrevAkali({ kda: [false, 0], trueDamage: [false, 0] })
    // prev_kda = [];
    // prev_trueDamage = [];
  };

  // championSelectedList, displayClickedChampion, displayActivation
  // this useEffect is for organizing traits from selected list of champions
  useEffect(() => {
    const collectTraits = {};
    // remove duplicate traits and add up those number of accumulated traits and sorting from high to low
    Object.values(championSelectedList).forEach((champ) => {
      champ.forEach((trait) => {
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
      // to identify which trait is activated and inactivated for AKALI
      const updatedAkali = { kda: [false, 0], trueDamage: [false, 0] };
      // let updatedAkali = prevAkali
      // to store and group by the trait results by activated or inactivated
      const activatedCategories = [];
      const inactivatedCategories = [];
      Object.entries(collectTraits).forEach(([trait, value]) => {
        // check if the the current trait equals or greater than any number of the activation array
        const activated = value[1].some((num) => {
          // if kda or trueDamage is activated then update it to be true and save the trait
          if ((trait === 'kda' || trait === 'trueDamage') && value[0] >= num) {
            updatedAkali[trait][0] = true;
            updatedAkali[trait][1] = value[0];
          }
          return value[0] >= num;
        });
        // update previous values to be compared for the next time
        if (trait === 'kda' || trait === 'trueDamage') {
          setPrevAkali(prev => {
            prev[trait][0] = updatedAkali[trait][0]
            prev[trait][1] = value[0]
            return prev
          })
        }

        // group them by activated and inactivated
        if (activated) {
          activatedCategories.push([trait, value]);
        } else {
          inactivatedCategories.push([trait, value]);
        }
      });
      const activatedCat = Object.fromEntries(activatedCategories);
      const inactivatedCat = Object.fromEntries(inactivatedCategories);
      // if both traits are activated for AKALI
      if (updatedAkali.kda[0] && updatedAkali.trueDamage[0]) {
        // compare the value, if they are equal
        if (updatedAkali.kda[1] === updatedAkali.trueDamage[1]) {
          // then find out which trait was added last
          if (prevAkali.kda[1] < prevAkali.trueDamage[1]) {
            // console.log(" kda was added lately so remove truedamage")
            activatedCat.trueDamage[0] += -1;
          }
          if (prevAkali.kda[1] > prevAkali.trueDamage[1]) {
            // console.log(" TD was added lately so remove kda")
            activatedCat.kda[0] += -1;
          }
        }
        // if both are activated but KDA has higher value
        if (updatedAkali.kda[1] > updatedAkali.trueDamage[1]) {
          activatedCat.trueDamage[0] += -1;
          // console.log("deduct 1 activated trueDamage")
        }
        if (updatedAkali.kda[1] < updatedAkali.trueDamage[1]) {
          activatedCat.kda[0] += -1;
          // console.log("deduct 1 activated kda")
        }
        // if kda is activated only, deduct 1 from trueDamage
      } else if (updatedAkali.kda[0] && !updatedAkali.trueDamage[0]) {
        // trueDamage may not exist at this point in inactivatedCategories
        if (inactivatedCat.trueDamage) {
          // console.log("deduct 1 inactivated trueDamage")
          inactivatedCat.trueDamage[0] += -1;
        }
        // if trueDamage is activated only, deduct 1 from kda
      } else if (updatedAkali.trueDamage[0] && !updatedAkali.kda[0]) {
        // kda may not exist at this point in inactivatedCategories
        if (inactivatedCat.kda) {
          // console.log("deduct 1 inactivated kda")
          inactivatedCat.kda[0] += -1;
        }
      }
    
      // this variable is for saving inactivated traits and re-arrange them by diffence as a key and name of traits as value
      let traitDifference = {};
      let sortedInactivatedCategories = [];
      if (inactivatedCategories.length > 1) {
        // Sort inactivated categories by least differences to smallest activation number by high to low
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
          // Sort by least differences from low to high
          if (differenceA !== differenceB) {
            return differenceA - differenceB;
          }
          // If differences are equal, sort values by high to low
          return b[1][0] - a[1][0];
        });
      } else if (inactivatedCategories.length === 1) {
        const cat = inactivatedCategories[0];
        const difference = Math.abs(cat[1][0] - cat[1][1][0]);
        traitDifference[cat[0]] = difference;
        sortedInactivatedCategories = inactivatedCategories;
      }
      // re-arrange the trait differences by {1:[name of traits], 2:[name of traits]}
      const traitDifferenceList = Object.entries(traitDifference).reduce(
        (acc, [key, value]) => {
          if (!acc[value]) {
            acc[value] = [];
          }
          acc[value].push(key);
          return acc;
        },
        {}
      );
    
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
        return b[1][0] - a[1][0];
      });
      // Combine sorted activated and inactivated categories
      const sortedData = sortedActivatedCategories.concat(
        sortedInactivatedCategories
      );
      return [sortedData, traitDifferenceList];
    }

  }, [championSelectedList, displayClickedChampion, displayActivation, prevAkali]);

  return (
    <>
      {/* display all champions */}
      <ChampionsList champs={champs} onClickHandler={onClickHandler} selectedChampion={selectedChampion}
      />
      {/* <button onClick={()=>refreshHandler()}>Refresh</button> */}
      {/* display currently selected champion */}
      <CurrentChampion displayClickedChampion={displayClickedChampion} />
      {/* display selected list of champions */}
      <SelectedChampions championSelectedList={championSelectedList} refreshHandler={refreshHandler}
      />
      {/* display traits of all selected champions */}
      <Traits showAllTraits={showAllTraits} />
      {/* display recommended champions to activate traits */}
      <Recommendation recommendChamp={recommendChamp} championSelectedList={championSelectedList}/>
    </>
  );
}

export default App;
