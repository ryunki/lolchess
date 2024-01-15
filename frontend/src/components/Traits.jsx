import './style.css'
import '../css/traits.css'

const Traits = ({ showAllTraits }) => {

const displayActivation = (trait, current, indicator) =>{
  let activated = [false, 0]
  indicator.forEach((level,idx) =>{
    if(current >= level){
      activated = [true, idx]
    }
  })
  if(activated[0]){
    return <>
      <div className='activatedValue'>
        <div>{current}</div>
      </div>
      <div className='trait-wrapper'>
        <div className='font-white'>{trait}</div>
        <div style={{display: 'inline-flex',gap: '4px'}}>
          {indicator.map((number,idx, arr) =>{
            if(idx === activated[1]){
              return <div className='font-white level-indicator-text' key={idx} style={{display:'flex'}}>{number}</div>
            }else{
              return <div className='no-highlight level-indicator-text' key={idx}>{number}</div>
            }
          })}
        </div>
      </div>
    </>
  }else{
    return <>
      <div className='trait-wrapper'>
        <div className='font-white'>{trait}</div>
        <div className='no-highlight level-indicator-text' style={{display: 'inline-flex'}}>
          {current} / {indicator[0]}
        </div>
      </div>
    </>
  }
  // const res = indicator.map((level, idx, arr)=>{
  //   // if the trait meets the any of the activation number it highlights
  //   if (level <= current){
  //     return <div className = "highlight" key={idx}>
  //       {level}
  //     </div>
  //   }else{
  //     // if the trait is not activated
  //     if(current < arr[0]){
  //       if(idx > 0){
  //         // this prevent from showing rest of the activation number
  //         return null
  //       }
  //       // this shows the first activation number 
  //       return <div className = "" key={idx}> {level}</div>
  //     }
  //     // this shows all the activation numbers for activated traits
  //     return <div className = "" key={idx}> {level}</div>
  //   }
  // })
  // return <>
  //  {res} 
  // </>
}
  return (
    <div className='info-container'>
      <div>
        <h4>Selected Champions' Traits</h4>
      </div>
      <div>
        {showAllTraits &&
          Object.entries(showAllTraits).map(([trait, value]) => {
            return (
              <div className='trait-background' key={trait} style={{display:'flex', textAlign:'center'}} >
                  {displayActivation(trait, value[0], value[1])}
              </div>
            );
          })}
        {/* {showAllTraits && traitsManipulation(showAllTraits)} */}
      </div>
    </div>
    
  );
};

export default Traits;
