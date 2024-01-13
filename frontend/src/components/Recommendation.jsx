// @ts-nocheck

const Recommendation = ({ recommendChamp}) => {
  //  dataForRecommendation
  // 1: [trait1,trait2,trait3]
  // 2: [trait1,trait2,trait3]
  
  return (<>
    <div>Recommendation</div>
    {recommendChamp && Object.entries(recommendChamp).map((item, idx) => {
      return <div key={idx}> {item[1][0]} ({item[1][1]})</div>
    })}
  </>
  )
}

export default Recommendation