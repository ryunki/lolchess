import '../css/ChampionsList.css';

const CurrentChampion = ({ displayClickedChampion, costArray }) => {
  // console.log(displayClickedChampion);
  return (
    <div className='info-container'>
      <div>
          <h4>Currently Clicked Champion</h4>
      </div>
      {displayClickedChampion.length !== 0 ? (
        <>
          <div className={`champion-item ${costArray[displayClickedChampion[0][0][1]]}`}>
            {displayClickedChampion[0][0][0]}
          </div>
          <div>
            
              {/* {displayClickedChampion[0] && displayClickedChampion[1].length !== 0 && <h4>Traits</h4>} */}
              {displayClickedChampion[0] &&
                displayClickedChampion[1].map((item, idx) => (
                  <div key={idx}> {item} </div>
                ))}
            
          </div>
        </>
      ) : null}
    </div>
  );
};

export default CurrentChampion;
