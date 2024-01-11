

const SelectedChampions = ({championSelectedList}) => {
  return (
    <>
    <h3>Selected Champions ({Object.keys(championSelectedList).length})</h3>
      <ul>
        {championSelectedList &&
          Object.keys(championSelectedList).map((item, idx) => <li key={idx}>{item}</li>)}
      </ul>
    </>
  )
}

export default SelectedChampions