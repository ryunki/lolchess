
import '../css/ChampionsList.css';
import { champs, synergy } from '../constants';
const SelectedChampions = ({championSelectedList, refreshHandler, costArray}) => {

  return (
    <div className='info-container'>
      <div className='align-horizontal'>
        <h4>Selected Champions ({Object.keys(championSelectedList).length})</h4>
        <div className='reset' onClick={()=>refreshHandler()}>reset</div>
      </div>
    {/* <button onClick={()=>goBackHandler()}>Go Back</button> */}
      <div>
        {Object.keys(championSelectedList).length !== 0 &&
          Object.entries(championSelectedList).map(([champ, info],idx)=>
          <div key={idx} className={`champion-item ${costArray[info.cost]}`}> {champ}</div>
          )}
      </div>
    </div>
  )
}

export default SelectedChampions