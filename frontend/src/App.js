
import { useState } from 'react';

const champs = [
  'Akali','Yorick','Bard','Lux','Nami','Lucian','Miss','Ziggs','Taric','Gragas','Blitzcrank','Twisted Fate',
];
const synergy = {
  classes: {
    dazzler: ['Nami', 'Bard', 'Lux', 'Twisted Fate', 'Ziggs'],
    guardian: ['Yorick'],
    mosher: ['Yorick'],
    breakout: ['Akali'],
    executioner: ['Akali'],
  },
  origins: {
    trueDamage: ['Akali'],
    kda: ['Akali'],
    pentakill: ['Yorick'],
    jazz: ['Bard', 'Miss', 'Lucian'],
    disco: ['Nami', 'Taric', 'Gragas', 'Blitzcrank', 'Twisted Fate'],
  },
};
// to store all the traits of selected champions
var prev_traits = []

function App() {
  // display selected champion
  const [displaySelectedChampion, setDisplaySelectedChampion] = useState('');
  // state that stores selected list of champions
  const [championSelectedList, setChampionSelectedList] = useState([]);
  // display all the traits of selected champions
  const [showAllTraits, setShowAllTraits] = useState({});
  // display traits of selected champions
  const [showTraits, setShowTraits] = useState([]);

  // when user selects multiple champions (remove duplicates)
  const addChampionsToList = (champ) => {
    setChampionSelectedList((prev) => {
      const list = [...prev, champ];
      return Array.from(new Set(list));
    });
  };
  // when a champion is clicked
  const onClickHandler = (champ) => {
    // display selected champion
    setDisplaySelectedChampion(champ);
    // a function for finding traits of selected champion
    findChampionTraits(champ);
  };
  // find selected champion's traits
  const findChampionTraits = (champ) => {
    // this variable is to store the traits of selected champion (this resets for every click)
    var display_traits_for_selected_champion = []
    // loop though the classes
    Object.keys(synergy.classes).forEach((clas) => {
      // look for selected champion in every class
      for (const name_of_champion of synergy.classes[clas]) {
        if (name_of_champion === champ) {
          console.log(`${champ} found in `, clas);
          // prevent from adding duplicated class to the list when the same champion is clicked again
          if (!championSelectedList.includes(champ)) {
            setShowTraits(clas);
            // add class to global variable to accumulate traits
            prev_traits.push(clas)
          }
          // this will be stored in a state later
          display_traits_for_selected_champion.push(clas)
        }
      }
    });

    Object.keys(synergy.origins).forEach((orig) => {
      for (const name_of_champion of synergy.origins[orig]) {
        // if the selected champion is found in the array of origins
        if (name_of_champion === champ) {
          console.log(`${champ} found in `, orig);
          // prevent from adding duplicated champions and synergy to the list when the same champion is clicked again
          if (!championSelectedList.includes(champ)) {
            setShowTraits(orig);
            // add origin to global variable to accumulate traits
            prev_traits.push(orig)
          }
          display_traits_for_selected_champion.push(orig)
        }
      }
    });
    // create a new variable to store the calculated traits from the global variable 
    var new_traits = []
    // this is to add up the number of duplicate traits and add as value to a key
    prev_traits.forEach(item=>{
      new_traits[item] = (new_traits[item] || 0 ) + 1
    })
    // display accumulated traits from the list of all the selected champions
    setShowAllTraits(new_traits)
    // a function for adding selected champions to the list
    addChampionsToList(champ);
    // display traits of selected champion
    setShowTraits(display_traits_for_selected_champion)
  };

  return (
    <>
      <div>
        <h1>Champs List</h1>
        {champs.map((champ, idx) => (
          <button key={idx} onClick={() => onClickHandler(champ)}>
            {champ}
          </button>
        ))}
      </div>
      <div>{displaySelectedChampion && displaySelectedChampion}</div>
        traits
      <ul>
        {showTraits && showTraits.map((item,idx)=>(
          <li key = {idx}>{item}</li> 
        ))}
      </ul>
      <h3>Selected Champions ({championSelectedList.length})</h3>
      <ul>
        {championSelectedList &&
          championSelectedList.map((item, idx) => <li key={idx}>{item}</li>)}
      </ul>
      <h3>Selected Champions' Synergy</h3>
      <ul>
       
        {showAllTraits && Object.entries(showAllTraits).map(([key,value])=>{
          return <li key = {key}> {key}: {value} </li>
        })}
        {console.log(showAllTraits)}
        
      </ul>
    </>
  );
}

export default App;
