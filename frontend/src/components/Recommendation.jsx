// @ts-nocheck
import { useState, useEffect } from 'react';
import { champs, synergy } from '../constants';
import '../css/ChampionsList.css';
import '../css/style.css';
import '../css/recommendation.css';

const Recommendation = ({
  recommendChamp,
  championSelectedList,
  costArray,
}) => {
  // display recommended champions
  const [displayRecommendChamp, setDisplayRecommendChamp] = useState({});
  // number of traits will be added for each champion
  const [champAppearance, setChampAppearance] = useState({});

  useEffect(() => {
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
    Object.keys(recommendedChampionsList).forEach((trait) => {
      recommendedChampionsList[trait] = recommendedChampionsList[trait].filter(
        (item) => !selectedChampions.includes(item[0])
      );
    });

    const champAppearances = {};
    // find the number of traits to be added for each champion
    Object.values(recommendedChampionsList).forEach((champions) => {
      champions.forEach(([champ, cost]) => {
        champAppearances[champ] = (champAppearances[champ] || 0) + 1;
      });
    });
    setDisplayRecommendChamp(recommendedChampionsList);
    setChampAppearance(champAppearances);
  }, [recommendChamp]);
  // console.log(displayRecommendChamp)
  return (
    <>
      {/* <div className='title'>Recommendation</div> */}
      {
        <div className="contents-container">
          {Object.entries(displayRecommendChamp).map(([trait, champs]) => {
            return (
              <div className="recommended-traits-container" key={trait}style={{ margin: '10px auto' }}>
                <div className='font-white'>{trait} </div>
                {champs.map((item, idx) => {
                  return (
                    <div key={item[0] + '-' + trait} className={`champion-item-small ${costArray[item[1]]}`}>
                      {item[0]} <div className='number-of-synergy'>{champAppearance[item[0]]}</div>
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
