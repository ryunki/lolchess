import '../css/ChampionsList.css'

const ChampionsList = ({champs, onClickHandler}) => {
  return (
    <>
    <h1>Champs List</h1>
    <div className='champions_list_wrapper'>
        {champs.map((champ, idx) => (
          <div  key = {idx} className = {'button'} onClick={(e)=>onClickHandler(champ,e)}>
              {champ}
            </div>
        ))}
    </div>
    </>
  )
}

export default ChampionsList