import React from 'react'

const Buttons = ({userRecoil,deckRecoil,isMyCompositionsClicked,openDeckInput,championSelectedList,compositionInputRef,compositionInputRef2,displayCompositionsHandler,setDeckName,deckName,saveHandler,refreshHandler}) => {
  return (<>
    {/* if normal user is logged in  */}
    {userRecoil && userRecoil?.username !== 'admin' ?
    <>
    {/* if a user has compositions in DB */}
      {Object.keys(deckRecoil).length !== 0 ? 
      <div className="buttons-container compositions-container">
        <div className={`buttons-wrapper ${isMyCompositionsClicked && 'opacity'}`} onClick={() => displayCompositionsHandler()}>
              {' '} My Compositions
        </div>
        {/*when save button is clicked. display input for naming a composition */}
        {openDeckInput && Object.keys(championSelectedList).length !== 0 &&(
          <div className='composition-wrapper'>
            <div style={{display: 'flex', alignItems: 'center'}}className='font-white'>Name</div>
            <input className='composition-input'  ref={compositionInputRef}  onChange={(e) => setDeckName(e.target.value)}  type='text' id='composition' name='composition'value={deckName}/>
          </div>
        )}
        {/* display save button when champion is selected*/}
        {Object.keys(championSelectedList).length !== 0 &&(
          <div ref={compositionInputRef2} className='buttons-wrapper-green' onClick={() => saveHandler()}>
            save
          </div>
        )}
        {Object.keys(championSelectedList).length !== 0 && 
        <div className='buttons-wrapper-gray' onClick={() => refreshHandler()}>
          reset
        </div>
        }
      </div> 
      : <>
      {/*if a user doesnt have any compositions */}
      {Object.keys(championSelectedList).length !== 0 && 
        <div className="buttons-container compositions-container">
          {/*when save button is clicked. display input for naming a composition */}
          {openDeckInput && Object.keys(championSelectedList).length !== 0 &&(
            <div className='composition-wrapper'>
              <div style={{display: 'flex', alignItems: 'center'}}className='font-white'>Name</div>
              <input className='composition-input'  ref={compositionInputRef}  onChange={(e) => setDeckName(e.target.value)}  type='text' id='composition' name='composition'value={deckName}/>
            </div>
          )}
          <div ref={compositionInputRef2} className='buttons-wrapper-green' onClick={() => saveHandler()}>
            save
          </div>
          <div className='buttons-wrapper-gray' onClick={() => refreshHandler()}>
            reset
          </div>
          </div>
      }
      </>
      }
    </>
    // when user is not logged in and clicks a champion from the list
    :<>
    {Object.keys(championSelectedList).length !== 0 && 
    <div className="buttons-container ">
      <div className='buttons-wrapper-gray' onClick={() => refreshHandler()}>
            reset
          </div>
      </div>
    }
    </>

    } 
    </>
  )
}

export default Buttons