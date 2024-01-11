
const styles = {
  color: 'red',
};

const Traits = ({ showAllTraits }) => {
// console.log(showAllTraits)
const displayActivation = (current, indicator) =>{
  // console.log(value)
  const res = indicator.map((item, idx)=>{
    if (item <= current){
      return <text style={styles}>
        {item}
      </text>
    }else{
      return <text> {item}</text>
    }
  })

  return <>
  {current} / {res}
  </>
}
  return (
    <>
    <h3>Selected Champions' Traits</h3>
      <ul>
        {showAllTraits &&
          Object.entries(showAllTraits).map(([key, value]) => {
            return (
              <li key={key}>
                {key}: {displayActivation(value[0], value[1])}
              </li>
            );
          })}
      </ul>
    </>
    
  );
};

export default Traits;
