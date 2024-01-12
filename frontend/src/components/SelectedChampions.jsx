

const SelectedChampions = ({championSelectedList, refreshHandler,goBackHandler}) => {
  return (
    <>
    <h3>Selected Champions ({Object.keys(championSelectedList).length})</h3>
    <button onClick={()=>refreshHandler()}>Refresh</button>
    {/* <button onClick={()=>goBackHandler()}>Go Back</button> */}
      <ul>
        {championSelectedList &&
          Object.keys(championSelectedList).map((item, idx) => <li key={idx}>{item}</li>)}
      </ul>
    </>
  )
}

export default SelectedChampions