
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
var traits = []

function App() {
  // selected champion
  const [displaySelectedChampion, setDisplaySelectedChampion] = useState('');
  // state that stores selected list of champions
  const [championSelectedList, setChampionSelectedList] = useState([]);
  const [synergyList, setSynergyList] = useState({});
  const [showTraits, setShowTraits] = useState([]);


  // when user selects multiple champions (remove duplicates)
  const addChampionsToList = (champ) => {
    setChampionSelectedList((prev) => {
      const list = [...prev, champ];
      return Array.from(new Set(list));
    });
  };

  const onClickHandler = (champ) => {
    setDisplaySelectedChampion(champ);
    findChampionTraits(champ);
  };
  // find selected champion's class
  const findChampionTraits = (champ) => {
    var display_traits_for_selected_champion = []
    // loop though the classes
    Object.keys(synergy.classes).forEach((clas) => {
      // look for selected champion in every class
      for (const name_of_champion of synergy.classes[clas]) {
        if (name_of_champion === champ) {
          console.log(`${champ} found in `, clas);
          // prevent from adding duplicated champions and synergy to the list
          if (!championSelectedList.includes(champ)) {
            setShowTraits(clas);
            traits.push(clas)
          }
          // break;
          display_traits_for_selected_champion.push(clas)
        } else {
          console.log(`${champ} not found in `, clas);
          // remove previous class if the new selected champion doesnt have the class
          // setShowTraits('');
        }
      }
    });

    Object.keys(synergy.origins).forEach((orig) => {
      for (const name_of_champion of synergy.origins[orig]) {
        // break out of loop when origin of champion is found
        // if (origin_of_champion === champ) break;
        // if the selected champion is found in the array of origins
        if (name_of_champion === champ) {
          console.log(`${champ} found in `, orig);
          // prevent from adding duplicated champions and synergy to the list
          if (!championSelectedList.includes(champ)) {
            // addSynergyToList(orig);
            setShowTraits(orig);
            traits.push(orig)
          }
          // break;
          display_traits_for_selected_champion.push(orig)
        } else {
          console.log(`${champ} not found in `, orig);
          // remove previous origin if the new selected champion doesnt have the origin
          // setShowTraits('');
        }
      }
    });
    var new_traits = []
    traits.sort()
    traits.forEach(item=>{
      new_traits[item] = (new_traits[item] || 0 ) + 1
    })
    setSynergyList(new_traits)
    addChampionsToList(champ);
    setShowTraits(display_traits_for_selected_champion)
  };
console.log('seynergy LIST: ',synergyList)
console.log('seynergy LIST: ',showTraits)

// useState(()=>{
//   setShowTraits(()=>{
//     // console.log('set show traits')
//     return new_traits})
// },[new_traits])

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
       
        {synergyList && Object.entries(synergyList).map(([key,value])=>{
          return <li key = {key}> {key}: {value} </li>
        })}
        {console.log(synergyList)}
        
      </ul>
    </>
  );
}

export default App;
