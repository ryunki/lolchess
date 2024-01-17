// @ts-nocheck
import { useState } from 'react';
import { champs } from '../constants';
import '../css/ChampionsList.css';

const ChampionsList = ({ onClickHandler, selectedChampion, costArray}) => {
  const [sortAtoZ, setSortAtoZ] = useState(true);
  const [sortCost, setSortCost] = useState([false, 0]);
 
  // display all champions
  const [champions, setChampions] = useState(champs);
  
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
  const toggleCost = (cost) => {
    // when cost button is clicked (sort by cost)
    if(cost === 'cost'){
      setChampions(() => {
        return champs.sort((a,b)=> !sortAtoZ ? b[0].localeCompare(a[0]) : a[0].localeCompare(b[0]))
          .sort((a, b) => sortCost[0] ? a[1] - b[1] : b[1] - a[1]);
      });
      setSortCost([!sortCost[0], 0]);
      // when one of the indicator is clicked. display the clicked cost of champions only
    }else{
      // if the same indicator is clicked again 
      if (sortCost[1] === cost){
        // then display whole list of champions 
        setChampions(()=>{
          // sort by current state of sortAtoZ
          return champs.sort((a,b)=> sortAtoZ ? a[0].localeCompare(b[0]): b[0].localeCompare(a[0]) )
        })
        setSortCost([sortCost, 0])
        // if different cost indicator is clicked
      } else {
        setChampions(()=>{
          // first filter by the clicked cost, then sort by current state of sortAtoZ
          return champs.filter((item)=> item[1] === cost)
            .sort((a,b)=> sortAtoZ ? a[0].localeCompare(b[0]): b[0].localeCompare(a[0]) )
        })
        setSortCost([sortCost, cost])
      }
    }
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
      
        <div className='search-sort-container'>
          <input className='input-search-champion'
            placeholder="search"
            onChange={(e) => searchChampionHandler(e)}
          />
          <div
            value={sortAtoZ}
            className="sort indicator"
            style={{ cursor: 'pointer' }}
            onClick={toggleAtoZ}
          >
            {sortAtoZ ? 'AtoZ' : 'ZtoA'}
          </div>

          <div className="sort indicator" style={{ cursor: 'pointer' }}onClick={()=>toggleCost('cost')}>
            Cost
          </div>
          <div className='cost-indicator' style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ paddingLeft: '8px'}}>5</span>
             <div className="five-indicator indicator-c" onClick={()=>toggleCost(5)}/>
            4<div className="four-indicator indicator-c" onClick={()=>toggleCost(4)}/>
            3<div className="three-indicator indicator-c" onClick={()=>toggleCost(3)}/>
            2<div className="two-indicator indicator-c" onClick={()=>toggleCost(2)}/>
            1<div className="one-indicator indicator-c" onClick={()=>toggleCost(1)}/>
          </div>
        </div>
      <div className="champions_list_wrapper">
        {champions.length !== 0 ? 
          champions.map((champ, idx) => (
              <div
                key={idx}
                className={`champion-item ${costArray[champ[1]]} ${
                  selectedChampion.includes(champ[0]) ? 'selected' : ''
                } `}
                // onClick={() => onClickHandler(champ[0])}
                onClick={() => onClickHandler(champ)}
              >
                {champ[0]}
              </div>
          )) :
          <div className="no-result">
            No Champions
          </div>
        }
      </div>
    </>
  );
};

export default ChampionsList;
