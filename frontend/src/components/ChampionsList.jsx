

const ChampionsList = ({champs, onClickHandler}) => {
  return (
    <>
    <h1>Champs List</h1>
        {champs.map((champ, idx) => (
          <button key={idx} onClick={() => onClickHandler(champ)}>
            {champ}
          </button>
        ))}
    </>
  )
}

export default ChampionsList