import '../css/ChampionsList.css'

const ChampionsList = ({champs, onClickHandler,selectedChampion}) => {
  return (
    <>
    <h1>Champs List</h1>
    <div className='champions_list_wrapper'>
        {champs.map((champ, idx) => (
          <div  key = {idx} className = {`champion-item ${selectedChampion.includes(champ) ? 'selected' : ''}`} onClick={()=>onClickHandler(champ)}>
              {champ}
            </div>
        ))}
    </div>
    </>
  )
}

export default ChampionsList