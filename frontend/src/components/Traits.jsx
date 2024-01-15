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
   {res} 
  </>
}
  return (
    <div className='info-container'>
      <div>
        <h4>Selected Champions' Traits</h4>
      </div>
      <div>
        {showAllTraits &&
          Object.entries(showAllTraits).map(([key, value]) => {
            return (
              <div key={key} style={{display:'flex', textAlign:'center'}} >
                  <div>
                    {value[0]}
                  </div>
                    {key} {displayActivation(value[0], value[1])}
              </div>
            );
          })}
        {/* {showAllTraits && traitsManipulation(showAllTraits)} */}
      </div>
    </div>
    
  );
};

export default Traits;
