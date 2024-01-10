

const SelectedChampions = ({championSelectedList}) => {
  return (
    <>
    <h3>Selected Champions ({championSelectedList.length})</h3>
      <ul>
        {championSelectedList &&
          championSelectedList.map((item, idx) => <li key={idx}>{item}</li>)}
      </ul>
    </>
  )
}

export default SelectedChampions