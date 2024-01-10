

const CurrentChampion = ({displaySelectedChampion, showTraits}) => {
  return (
    <>
    <div>{displaySelectedChampion && displaySelectedChampion}</div>
        --traits--
      <ul>
        {showTraits && showTraits.map((item,idx)=>(
          <li key = {idx}>{item}</li> 
        ))}
      </ul>
    </>
  )
}

export default CurrentChampion