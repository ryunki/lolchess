
import '../css/traits.css'
import '../css/style.css';
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
      <div className='activatedValue highlight '>
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
}
  return (
    <div className='trait-wrapper' style={{display: 'flex'}}>
        {
          Object.entries(showAllTraits).map(([trait, value]) => {
            return (
              <div className='trait-background' key={trait} style={{display:'flex', textAlign:'center'}} >
                  {displayActivation(trait, value[0], value[1])}
              </div>
            );
          })}
    </div>
    
  );
};

export default Traits;
