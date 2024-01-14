// @ts-nocheck
import { useEffect, useState } from 'react';
import { champs } from '../constants';
import '../css/ChampionsList.css';

const ChampionsList = ({ onClickHandler, selectedChampion }) => {
  const [sortAtoZ, setSortAtoZ] = useState(true);
  const [sortCost, setSortCost] = useState(true);
  const [champions, setChampions] = useState(champs);
  // champion's cost array for displaying color
  const costArray = ['', 'one', 'two', 'three', 'four', 'five'];

  // change alphabetical order of champion list
  const toggleAtoZ = () => {
    setSortAtoZ(!sortAtoZ);
    setChampions(prev =>{
      return [...prev].sort((a, b) => {
        return sortAtoZ ? b[0].localeCompare(a[0]) : a[0].localeCompare(b[0]) ;
      });
    })
  };
  // change cost order of champion list
  const toggleCost = () => {
    setSortCost(!sortCost);
    setChampions(prev=>{
      return [...prev].sort((a, b) => {
        return sortCost ? a[1] - b[1] : b[1] - a[1];
      });
    })
  };

  return (
    <>
      <div>
        <div>
          <h1>Champs List</h1>
        </div>
        <div style={{ display: 'flex' }}>
          <div style={{ cursor: 'pointer' }} onClick={toggleAtoZ}>
            {sortAtoZ ? 'Z-A' : 'A-Z'}
          </div>{' '}
          &nbsp;&nbsp;
          <div style={{ cursor: 'pointer' }} onClick={toggleCost}>
            COST
          </div>
        </div>
      </div>
      <div className="champions_list_wrapper">
        {champions.map((champ, idx) => {
          return (
            <div
              key={idx}
              className={`champion-item blurred-edge ${costArray[champ[1]]} ${
                selectedChampion.includes(champ[0]) ? 'selected' : ''
              } `}
              onClick={() => onClickHandler(champ[0])}
            >
              {champ[0]}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default ChampionsList;
