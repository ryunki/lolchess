import { useEffect } from 'react';

import '../css/traits.css'
import '../css/style.css';
const Traits = ({ showAllTraits }) => {

// this function for giving highlight effect for activated synergy
// const displayActivation = ([trait, current, indicator]) =>{
const displayActivation = (data) =>{
  let trait = ''
  let current = 0
  let indicator = []
  if(data){
    trait = data[0]
    current = data[1][0]
    indicator = data[1][1]
  }

  let activated = [false, 0]

  indicator.forEach((level,idx) =>{
    if(current >= level){
      activated = [true, idx]
    }
  })

  // for activated synergy
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
    // for inactivated synergy
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
          Object.entries(showAllTraits).map(([trait, value],idx) => {
            return (
              <div className='trait-background' key={idx} style={{display:'flex', textAlign:'center'}} >
                  {displayActivation([trait,value])}
              </div>
            );
          })}
    </div>
    
  );
};

export default Traits;
