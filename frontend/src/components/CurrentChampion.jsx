import '../css/ChampionsList.css';
import '../css/style.css';
import '../css/CurrentChampion.css';

const CurrentChampion = ({ displayClickedChampion, costArray }) => {
  return (
    <>
    {
      <div className='info-container current-champ-container'>
          <div className={`champion-item ${costArray[displayClickedChampion[0][0][1]]}`}>
            {displayClickedChampion[0][0][0]}
          </div>
          <div className='font-white'>
            {/* displaying traits */}
              {displayClickedChampion[0] &&
                displayClickedChampion[1].map((item, idx) => (
                  <div className='current-traits' key={idx}> {item} </div>
                ))}
          </div>
      </div>
      }
    </>
  );
};

export default CurrentChampion;
