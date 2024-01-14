// @ts-nocheck
import { useState, useEffect } from 'react';
import { champs, synergy } from '../constants';

const Recommendation = ({ recommendChamp, championSelectedList}) => {
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

  },[recommendChamp])

  return (<>
    <div><h3>Recommendation</h3></div>
    {displayRecommendChamp && Object.entries(displayRecommendChamp).map(([trait,champs]) => {
      return <div key={trait}> <h4>{trait} </h4>
        {champs.map((item, idx)=>{
          console.log(item[0])
          return <div key={idx}>{item[0]} [activates {champAppearance[item[0]]}]</div>
        })}
      </div>
    })}
  </>)
}

export default Recommendation