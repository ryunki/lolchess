import './style.css'

const Traits = ({ showAllTraits }) => {
  
const displayActivation = (current, indicator) =>{
  const res = indicator.map((item, idx, arr)=>{
    // if the trait meets the any of the activation number it highlights
    if (item <= current){
      return <div className = "highlight" key={idx}>
        {item}
      </div>
    }else{
      // if the trait is not activated
      if(current < arr[0]){
        if(idx > 0){
          // this prevent from showing rest of the activation number
          return null
        }
        // this shows the first activation number 
        return <div className = "" key={idx}> {item}</div>
      }
      // this shows all the activation numbers for activated traits
      return <div className = "" key={idx}> {item}</div>
    }
  })

  return <>
  {current} [ {res} ]
  </>
}
  return (
    <>
    <h3>Selected Champions' Traits</h3>
      <ul className="horizontal-list">
        {showAllTraits &&
          Object.entries(showAllTraits).map(([key, value]) => {
            return (
              <li key={key} style={{display:"flex", margin:"5px", height:"20px"}} >
                <div style={{display:"flex"}}>
                  {key} {displayActivation(value[0], value[1])}
                </div>
              </li>
            );
          })}
        {/* {showAllTraits && traitsManipulation(showAllTraits)} */}
      </ul>
    </>
    
  );
};

export default Traits;
