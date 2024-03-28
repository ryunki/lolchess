// @ts-nocheck
import { useState, React } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import '../css/ChampionsList.css';

const ChampionsList = ({ onClickHandler, selectedChampion, costArray, displayChampions}) => {
  //  getChampions from parents component for sorting actions
  // sorting by certain cost filters the champions arraylist. 
  // so always get complete list of champions from parent's component
  const [sortAtoZ, setSortAtoZ] = useState(true);
  const [sortCost, setSortCost] = useState([false, 0]);
  
  // display all champions
  const [champions, setChampions] = useState({});
  
  // loading state
  const [loading, setLoading] = useState(false);
  
  // change alphabetical order of champion list
  const toggleAtoZ = () => {
    setSortAtoZ(!sortAtoZ);
    setChampions(() => {
      return [...displayChampions].sort((a, b) => {
        return sortAtoZ ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name);
      });
    });
  };
  // change cost order of champion list
  const toggleCost = (cost) => {
    // when cost button is clicked (sort by cost)
    if(cost === 'cost'){
      setChampions(() => {
        return [...displayChampions].sort((a,b)=> !sortAtoZ ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name))
          .sort((a, b) => sortCost[0] ? a.cost - b.cost : b.cost - a.cost);
      });
      // if the cost button is clicked twice in a row, trigger re-rendering
      if(sortCost[0]===false){
        setSortCost([true, 0]);
      }else{
        setSortCost([false, 0]);
      }
      // when one of the indicator is clicked. display the clicked cost of champions only
    }else{
      // if the same indicator is clicked again 
      if (sortCost[1] === cost){
        // then display whole list of champions 
        setChampions(()=>{
          // if the same indicator is clicked.
          if(sortCost[0] === false){
            setSortCost([true, cost])
            return [...displayChampions].filter((item)=> item.cost === cost)
            .sort((a,b)=> sortAtoZ ? a.name.localeCompare(b.name): b.name.localeCompare(a.name))
          }else{
            setSortCost([false, cost])
            // sort by current state of sortAtoZ
            return [...displayChampions].sort((a,b)=> sortAtoZ ? a.name.localeCompare(b.name): b.name.localeCompare(a.name) )
          }
        })
        // if different cost indicator is clicked
      } else {
        setChampions(()=>{
          // first filter by the clicked cost, then sort by current state of sortAtoZ
          return [...displayChampions].filter((item)=> item.cost === cost)
            .sort((a,b)=> sortAtoZ ? a.name.localeCompare(b.name): b.name.localeCompare(a.name))
        })
        setSortCost([true, cost])
      }
    }
  };

  // display champions as you type in the search bar
  const searchChampionHandler = (e) => {
    const typed = e.target.value.toLowerCase();
    console.log(typed)
    setChampions(() => {
      return [...displayChampions].filter((champ) => {
        return champ.name.toLowerCase().startsWith(typed);
      });
    });
  };

  // this useEffect is for initial rendering of champions
  useEffect(()=>{
    const getChampions = async () =>{
      setLoading(true)
      await axios.get('/api/content/champions').then(res=>{
        setChampions(res.data.champions)
        setLoading(false)
      }).catch(error=>{
        console.log(error)
      })
    }
    getChampions()
  },[])
  console.log('champions: ',champions)
  console.log('displayChampions: ',displayChampions)
  return (
    <>
    {loading && <div className="no-result">
            Loading...
          </div>
    }
    {!loading && 
    <>
      {Object.keys(champions).length !== 0 &&

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
        }

        <div className="champions_list_wrapper">
          {/* {Object.keys(champions).length !== 0  && Object.keys(displayChampions).length !== 0 ?  */}
          {Object.keys(champions).length !== 0 ? 
            Object.values(champions).map((champ, idx) => (
                <div key={idx}  className={`champion-item ${costArray[champ.cost]} ${selectedChampion.includes(champ.name) ? 'selected' : ''} `}onClick={() => onClickHandler([champ.name,champ.cost])}>
                  {champ.name}
                </div>
            )) :
            <div className="no-result">
              No champions
            </div>
          }
        </div>
      </>
    
    }

    </>
  );
};

export default ChampionsList;
