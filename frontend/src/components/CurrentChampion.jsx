

const CurrentChampion = ({displayClickedChampion}) => {
  return (
    <>
    <div>you clicked : {displayClickedChampion && displayClickedChampion[0]}</div>
      <ul>
        {displayClickedChampion[0] && displayClickedChampion[1].length !== 0 && <h4>Traits</h4>}
        {displayClickedChampion[0] && displayClickedChampion[1].map((item,idx)=>(
          <li key={idx}> {item} </li> 
        ))}
      </ul>
    </>
  )
}

export default CurrentChampion