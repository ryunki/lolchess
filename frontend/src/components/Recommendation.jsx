// @ts-nocheck
import { useState, useEffect } from 'react';
import { champs, synergy } from '../constants';
import '../css/ChampionsList.css';
import '../css/style.css';
import '../css/recommendation.css';

const Recommendation = ({recommendChamp,championSelectedList,costArray,}) => {
  // number of traits that will be added for each champion
  let champAppearance = {}

  // for storing the list of recommended champions
    let recommendedChampionsList = {};
    Object.entries(recommendChamp).forEach(([diff, arrayOfTraits]) => {
      arrayOfTraits.forEach((trait) => {
        findAllChampionsWithTrait('classes');
        findAllChampionsWithTrait('origins');
        function findAllChampionsWithTrait(type) {
          // find all the champs of every inactivated traits
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
    Object.keys(recommendedChampionsList).forEach((trait) => {
      recommendedChampionsList[trait] = recommendedChampionsList[trait].filter(
        (item) => !selectedChampions.includes(item[0])
      );
    });

    
    // find the number of traits to be added for each champion
    Object.values(recommendedChampionsList).forEach((champions) => {
      champions.forEach(([champ, cost]) => {
        champAppearance[champ] = (champAppearance[champ] || 0) + 1;
      });
    });
  
  return (
    <>
      {
        <div className="contents-container">
          {Object.entries(recommendedChampionsList).map(([trait, champs]) => {
            return (
              <div className="recommended-traits-container" key={trait}style={{ margin: '10px auto' }}>
                <div className='font-white'>{trait} </div>
                {champs.map((item, idx) => {
                  return (
                    <div key={item[0] + '-' + trait} className={`champion-item-small ${costArray[item[1]]}`}>
                      {item[0]} <div className={`number-of-synergy ${champAppearance[item[0]] > 1 ? 'highlight-recommend' : 'no-highlight-recommend'}`}>{champAppearance[item[0]]}</div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      }
    </>
  );
};

export default Recommendation;
