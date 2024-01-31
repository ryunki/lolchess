// @ts-nocheck
import CurrentChampion from '../components/CurrentChampion'
import ChampionsList from '../components/ChampionsList'
import SelectedChampions from '../components/SelectedChampions'
import Recommendation from '../components/Recommendation'
import Traits from '../components/Traits'
import Compositions from 'components/Compositions'
import ExtraTraits from 'components/ExtraTraits'

import { Modal } from 'components/Modal'
import { dataForTraitsAndRecommendation } from '../functions'

import { useState, useRef, useEffect } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { userInfo, userDeck } from '../recoil/stateAtoms'

import '../css/ChampionsList.css'
import '../css/style.css'
import axios from 'axios'
const Home = ({deckMessage,isModalOpen,openModal,closeModal }) => {
  // to display contents from API when page is opened
  const [getTraits, setGetTraits] = useState({})
  const [getChampions, setGetChampions] = useState({})
  // display selected champion -> [stores name, traits]
  const [displayClickedChampion, setDisplayClickedChampion] = useState([])
  // state that stores selected list of champions -> {champ: [traits], champ2: [traits]}
  const [championSelectedList, setChampionSelectedList] = useState({})
  // for changing color of selected champion
  const [selectedChampion, setSelectedChampion] = useState([])
  // showing all extra trait list
  const [displayExtraTraits, setDisplayExtraTraits] = useState({
    switch: false,
    traits: {},
  })
  // selecting extra trait, accumulate selected traits
  const [selectedTrait, setSelectedTrait] = useState({})
  // for opening a input for Deck name
  const [deckName, setDeckName] = useState('')
  const [openDeckInput, setOpenDeckInput] = useState(false)

  const [retrieveCompositions, setRetrieveCompositions] = useState(false)
  const userRecoil = useRecoilValue(userInfo)
  // save composition to recoil
  const [deckRecoil, setDeckRecoil] = useRecoilState(userDeck)
  // for selected composition
  const [selectedComposition, setSelectedComposition] = useState('')
  // displaying button for showing compositions
  const [displayCompositions, setDisplayCompositions] = useState(false)
  // button activation for 'My Compositions' button
  const [isMyCompositionsClicked, setIsMyCompositionsClicked] = useState(false)
  // when user clicks outside of input field for saving compositions
  const compositionInputRef = useRef(null)
  const compositionInputRef2 = useRef(null)

  // just a variable that saves results to display traits
  let showAllTraits = {}

  // display activation indicator corresponding to its trait
  let displayactivation = useRef({})
  // for saving info for comparison (Akali season 10)
  let traitHistory = useRef({ 'k/da': [false, 0], 'true damage': [false, 0] })

  // champion's cost array for displaying color
  const costArray = ['', 'one', 'two', 'three', 'four', 'five']

  const changeButtonColor = (champ) => {
    setSelectedChampion((prev) =>
      prev.includes(champ)
        ? prev.filter((item) => item !== champ)
        : [...prev, champ]
    )
  }

  useEffect(() => {
    // get traits to display when user clicks champion
    const getTraits = async () => {
      await axios
        .get('/api/content/traits')
        .then((res) => {
          let traits = []
          Object.values(res.data.traits).forEach((item, idx) => {
            traits[item.name] = {
              activation: item.activation,
              champions: item.champions,
            }
          })
          setGetTraits(traits)
        })
        .catch((error) => {
          console.log(error)
        })
    }
    getTraits()
    // display champions
    const getChampions = async () => {
      await axios
        .get('/api/content/champions')
        .then((res) => {
          setGetChampions(res.data.champions)
        })
        .catch((error) => {
          console.log(error)
        })
    }
    getChampions()
  }, [])

  // get champion compositions and save them to localstorage/recoil
  useEffect(() => {
    const getCompositions = async () => {
      await axios
        .get(`/api/users/compositions/${userRecoil._id}`)
        .then((res) => {
          setDeckRecoil(res.data.compositions)
          const jsonString = JSON.stringify(res.data.compositions)
          localStorage.setItem('compositions', jsonString)
        })
        .catch((error) => {
          console.log(error)
        })
    }
    // for preventing error from refresh.
    if (userRecoil) {
      getCompositions()
    }
  }, [userRecoil, retrieveCompositions])

  // Function to find traits for the selected champion
  const findTraits = (champ, selectedChampionTraits, activation) => {
    // go through array of champions in a trait
    Object.entries(getTraits).forEach(([trait, info]) => {
      Object.values(info.champions).forEach((champion) => {
        // if champion is found then save the trait and activation indicator
        if (champion[0] === champ) {
          selectedChampionTraits.push(trait)
          activation[trait] = info.activation
        }
      })
    })
  }

  const onClickHandler = (champ) => {
    changeButtonColor(champ[0])
    // this variable is to store the traits of selected champion (this resets for every click)
    let selectedChampionTraits = []
    // to store the array of activation indicators to corresponding traits
    let activation = []
    findTraits(champ[0], selectedChampionTraits, activation)
    if (championSelectedList[champ[0]]) {
      // if selected champion already exists in the list, remove it
      removeHandler(champ[0])
    } else {
      // if selected champion does not exist in the list, Add selected champions and traits to the list
      setChampionSelectedList((prev) => ({
        ...prev,
        [champ[0]]: {
          traits: selectedChampionTraits,
          cost: champ[1],
        },
      }))
    }

    // Add new traits and their activation indicator to the previous traits
    displayactivation.current = { ...displayactivation.current, ...activation }
    // to display currently clicked champion
    const cham = getChampions.filter(
      (item) => item.name.toLowerCase() === champ[0].toLowerCase()
    )

    setDisplayClickedChampion([
      [cham[0].name, cham[0].cost],
      selectedChampionTraits,
    ])
  }

  // remove the selected champion from the list
  const removeHandler = (champ) => {
    setChampionSelectedList((prev) => {
      // if clicked champion is the last one in the list
      if (Object.keys(prev).length === 1) {
        setDisplayClickedChampion([])
        setSelectedTrait({})
        // inactivate current composition selection
        setSelectedComposition('')
        // extra trait box closed
        setDisplayExtraTraits((prev) => ({ ...prev, switch: false }))
      }
      if (prev[champ]) {
        const updatedList = { ...prev }
        delete updatedList[champ]
        return updatedList
      }
      return prev
    })
  }

  const refreshHandler = () => {
    // delete currently clicked champion
    setDisplayClickedChampion([])
    // delete displayed list of champions
    setChampionSelectedList({})
    // delete selected champion
    setSelectedChampion([])
    // delete all the selected extra traits
    setSelectedTrait({})
    // extra trait box closed
    setDisplayExtraTraits((prev) => ({ ...prev, switch: false }))
    // delete all the saved traits and their activation indicators
    displayactivation.current = {}
    // delete trait history for comparison (Akali)
    traitHistory.current = { 'k/da': [false, 0], 'true damage': [false, 0] }
    // empty selected compositions
    setSelectedComposition('')
  }
  // when user clicks on save button
  const saveHandler = () => {
    if (openDeckInput) {
      // if input is already opened, save composition
      if (!deckName) {
        openModal('Make a name for your composition')
      } else {
        saveComposition()
        setOpenDeckInput(false)
      }
    } else {
      // if input field is closed, display input field
      setOpenDeckInput(true)
    }
  }
  // this useEffect is for save button and composition name's input field
  useEffect(() => {
    const clickedOutsideCompositionInput = (e) => {
      if (
        compositionInputRef.current &&
        !compositionInputRef.current.contains(e.target)
      ) {
        if (
          compositionInputRef2.current &&
          !compositionInputRef2.current.contains(e.target)
        ) {
          // when clicked outside of save button and input
          setOpenDeckInput(false)
        }
      }
    }
    document.addEventListener('click', clickedOutsideCompositionInput)
    return () => {
      document.removeEventListener('click', clickedOutsideCompositionInput)
    }
  }, [])
// if user clicks on 'My Compositions' button
  // show compositions on/off
  const displayCompositionsHandler = () => {
    setDisplayCompositions(!displayCompositions);
    setSelectedComposition('');
    setIsMyCompositionsClicked(!isMyCompositionsClicked)
  };
  // when saving composition, send extra added traits as well
  const saveComposition = async () => {
    await axios
        .post(`/api/users/composition`, {
          userId: userRecoil._id,
          championSelectedList,
          deckName,
          selectedTrait,
        })
        .then((res) => {
          // helper state for displaying updated compositions list
          setRetrieveCompositions(!retrieveCompositions)
          // show modal
          openModal(res.data.success)
          // remove current composition list of champions
          setChampionSelectedList({})
          setSelectedTrait({})
          setDisplayExtraTraits({ switch: false, traits: {} })
          setSelectedComposition('')
          // remove selected champion's effect from the main list
          setSelectedChampion([])
          setDeckName('')
        })
        .catch((error) => {
          openModal(error.response.data)
        })
  }

  // when user clicks 'add trait' button, display extra traits to add
  const showExtraTraitHandler = () => {
    let synergies = {}
    Object.entries(getTraits).forEach(([trait, info]) => {
      if (info.activation.length !== 1) {
        synergies[trait] = [1, info.activation]
      }
    })
    setDisplayExtraTraits({
      switch: !displayExtraTraits.switch,
      traits: synergies,
    })
  }

  showAllTraits = dataForTraitsAndRecommendation(
    championSelectedList,
    displayactivation.current,
    traitHistory,
    selectedTrait
  )

  return (
    <>
      <div className='background' style={{ padding: '50px 10%' }}>
        {/* display all champions */}
        <ChampionsList
          onClickHandler={onClickHandler}
          selectedChampion={selectedChampion}
          costArray={costArray}
          getChampions={getChampions}
          setSelectedComposition={setSelectedComposition}
        />
        {/* {console.log(userRecoil)} */}
        {userRecoil && userRecoil?.username !== 'admin' &&
        <div className="buttons-container compositions-container">
          {Object.keys(deckRecoil).length !== 0 &&
            <div className={`buttons-wrapper ${isMyCompositionsClicked && 'opacity'}`} onClick={() => displayCompositionsHandler()}>
                  {' '} My Compositions
            </div>
          }
          {Object.keys(championSelectedList).length !== 0 && <>
            {/* input for naming a composition */}
            {openDeckInput && (
              <div className='composition-wrapper'>
                <div style={{display: 'flex', alignItems: 'center'}}className='font-white'>Name</div>
                <input className='composition-input'  ref={compositionInputRef}  onChange={(e) => setDeckName(e.target.value)}  type='text' id='composition' name='composition'value={deckName}/>
              </div>
            )}
            {/* display save button when logged in */}
            {userRecoil && (
              <div ref={compositionInputRef2} className='buttons-wrapper-green' onClick={() => saveHandler()}>
                  save
                </div>
              )}
            <div className='buttons-wrapper-gray' onClick={() => refreshHandler()}>
              reset
            </div>
          </>}
        </div>
         } 
        {/* display compositions */}
        <Compositions
          getTraits={getTraits}
          displayCompositions={displayCompositions}
          displayactivation={displayactivation}
          setChampionSelectedList={setChampionSelectedList}
          setDisplayCompositions={setDisplayCompositions}
          setSelectedTrait={setSelectedTrait}
          selectedComposition={selectedComposition}
          setSelectedComposition={setSelectedComposition}
          setSelectedChampion={setSelectedChampion}
          retrieveCompositions={retrieveCompositions}
          setRetrieveCompositions={setRetrieveCompositions}
          openModal={openModal}
        />

        {Object.keys(championSelectedList).length !== 0 && (
          <>
          {userRecoil && userRecoil?.username !== 'admin' &&<>
              {/* display extra traits to add */}
            <ExtraTraits
            showExtraTraitHandler={showExtraTraitHandler}
            selectedTrait={selectedTrait}
            displayExtraTraits={displayExtraTraits}
            setSelectedTrait={setSelectedTrait}
            />
            </>
          }
            

            <div className='contents-container'>
              {/* display currently selected champion */}
              <CurrentChampion
                displayClickedChampion={displayClickedChampion}
                costArray={costArray}
              />
              {/* display selected list of champions */}
              <SelectedChampions
                championSelectedList={championSelectedList}
                refreshHandler={refreshHandler}
                costArray={costArray}
                onClickHandler={onClickHandler}
              />
            </div>
            {/* display traits of all selected champions */}
              {Object.keys(showAllTraits[0]).length !== 0 ? (
                <div className='contents-container'>
                  <Traits showAllTraits={showAllTraits[0]} />
                </div>
              ): <div className='contents-container font-white'>No traits</div>
            }
            <Recommendation
              recommendChamp={showAllTraits[1]}
              championSelectedList={championSelectedList}
              costArray={costArray}
              getTraits={getTraits}
            />
          </>
        )}
      </div>
    </>
  )
}

export default Home
