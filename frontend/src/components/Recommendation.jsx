// @ts-nocheck
import { useState, useEffect } from 'react';
import { champs, synergy } from '../constants';
import '../css/ChampionsList.css';

const Recommendation = ({ recommendChamp, championSelectedList, costArray}) => {
  // display recommended champions
  const [displayRecommendChamp, setDisplayRecommendChamp] = useState({})
  // number of traits will be added for each champion
  const [champAppearance, setChampAppearance] = useState({})

  useEffect(()=>{
    // for storing the list of recommended champions
    let recommendedChampionsList = {};
    Object.entries(recommendChamp).forEach(([diff, arrayOfTraits]) => {
      arrayOfTraits.forEach((trait) => {
        findAllChampionsWithTrait('classes');
        findAllChampionsWithTrait('origins');
        function findAllChampionsWithTrait(type) {
          // find all the champs of inactivated traits
          Object.keys(synergy[type]).forEach((item) => {
            if (trait === item) {
              // save the names of champion with the cost value
              recommendedChampionsList[trait] = [...synergy[type][item].champs];
            }
          });
        }
      });
    });
    // extract the names only from championSelectedList
    const selectedChampions = [...Object.keys(championSelectedList)];
    // remove list of selected champions name from the recommend list
    // {trait: [[champion, cost], [champion2, cost], [champion3, cost]], trait2: [...]}
    Object.keys(recommendedChampionsList).forEach((trait) =>{
      recommendedChampionsList[trait] = recommendedChampionsList[trait].filter(item => !selectedChampions.includes(item[0]))
    })

    const champAppearances = {}
    // find the number of traits to be added for each champion
    Object.values(recommendedChampionsList).forEach(champions=>{
      champions.forEach(([champ, cost])=>{
        champAppearances[champ] = (champAppearances[champ] || 0) + 1
      })
    })
    setDisplayRecommendChamp(recommendedChampionsList)
    setChampAppearance(champAppearances)
    console.log(recommendedChampionsList)
  },[recommendChamp])
// console.log(Object.entries(displayRecommendChamp))
  return (<div>
    <div><h3>Recommendation</h3></div>
    <div className='align-horizontal'>
      {Object.entries(displayRecommendChamp).length !==0 ? Object.entries(displayRecommendChamp).map(([trait,champs]) => {
        return <div key={trait} style={{margin:'10px auto'}}> 
          <h4>{trait} </h4>
          {champs.map((item, idx)=>{
            return <>
              <div key={item+'-'+trait} className={`champion-item-small ${costArray[item[1]]}`}>{item[0]} {champAppearance[item[0]]}</div> 
            </>
          })}
        </div>
      }) :
        <div><h4>No recommendation</h4></div>
      }
    </div>
  </div>)
}

export default Recommendation