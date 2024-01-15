// @ts-nocheck
import { useEffect, useState } from 'react';
import { champs } from '../constants';
import '../css/ChampionsList.css';

const ChampionsList = ({ onClickHandler, selectedChampion }) => {
  const [sortAtoZ, setSortAtoZ] = useState(true);
  const [sortCost, setSortCost] = useState(true);
  // display all champions
  const [champions, setChampions] = useState(champs);
  // champion's cost array for displaying color
  const costArray = ['', 'one', 'two', 'three', 'four', 'five'];

  // change alphabetical order of champion list
  const toggleAtoZ = () => {
    setSortAtoZ(!sortAtoZ);
    setChampions((prev) => {
      return [...prev].sort((a, b) => {
        return sortAtoZ ? b[0].localeCompare(a[0]) : a[0].localeCompare(b[0]);
      });
    });
  };
  // change cost order of champion list
  const toggleCost = () => {
    setSortCost(!sortCost);
    setChampions((prev) => {
      return [...prev].sort((a, b) => {
        return sortCost ? a[1] - b[1] : b[1] - a[1];
      });
    });
  };

  // display champions as you type in the search bar
  const searchChampionHandler = (e) => {
    const typed = e.target.value.toLowerCase();
    setChampions(() => {
      return champs.filter((champ) => {
        return champ[0].toLowerCase().startsWith(typed);
      });
    });
  };
 
  return (
    <>
      <div>
        <div>
          <h1>Champs List</h1>
        </div>
        <div style={{ display: 'flex' }}>
          <input
            placeholder="search champion"
            onChange={(e) => searchChampionHandler(e)}
          />
          <div
            value={sortAtoZ}
            className="sort"
            style={{ cursor: 'pointer' }}
            onClick={toggleAtoZ}
          >
            {sortAtoZ ? 'ZtoA' : 'AtoZ'}
          </div>

          <div
            className="sort"
            style={{ cursor: 'pointer' }}
            onClick={toggleCost}
          >
            Cost
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            5<div className="five-indicator" />
            4<div className="four-indicator" />
            3<div className="three-indicator" />
            2<div className="two-indicator" />
            1<div className="one-indicator" />
          </div>
        </div>
      </div>
      <div className="champions_list_wrapper">
        {champions.map((champ, idx) => {
          return (
            <div
              key={idx}
              className={`champion-item ${costArray[champ[1]]} ${
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
