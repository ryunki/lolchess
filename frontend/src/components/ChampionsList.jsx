import { useEffect, useState } from 'react'
import '../css/ChampionsList.css'

const ChampionsList = ({champs, onClickHandler,selectedChampion}) => {
  // console.log(champs)
  const costArray = ['','one', 'two', 'three', 'four', 'five']
 
  return (
    <>
    <h1>Champs List</h1>
    <div className='champions_list_wrapper'>
        {champs.map((champ, idx) => {
      
          return <div  key = {idx} className = {`champion-item blurred-edge ${costArray[champ[1]]} ${selectedChampion.includes(champ[0]) ? 'selected' : ''} `} onClick={()=>onClickHandler(champ[0])}>
              {champ[0]}
            </div>
})}
    </div>
    </>
  )
}

export default ChampionsList