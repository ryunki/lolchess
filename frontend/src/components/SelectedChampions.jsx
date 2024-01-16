
import '../css/ChampionsList.css';
import '../css/SelectedChampions.css';
import '../css/style.css';
import { champs, synergy } from '../constants';
const SelectedChampions = ({championSelectedList, refreshHandler, costArray ,onClickHandler}) => {
  
  return (
    <>
      {
        <div className='info-container'>
          {/* <div className='font-white'>
          {Object.keys(championSelectedList).length}
          </div> */}
          <div className='championlist-container'>
            {Object.entries(championSelectedList).map(([champ, info],idx)=>
              <div key={idx} className={`champion-item ${costArray[info.cost]}`} onClick={() => onClickHandler([champ, info])}> {champ}</div>
            )}
          </div>
          
          {/* <div className='reset' onClick={()=>refreshHandler()}>reset</div> 
           */}
        </div>
      }
    </>
  )
}

export default SelectedChampions