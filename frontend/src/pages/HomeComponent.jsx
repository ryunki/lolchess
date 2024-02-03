// @ts-nocheck
import CurrentChampion from '../components/CurrentChampion'
import ChampionsList from '../components/ChampionsList'
import SelectedChampions from '../components/SelectedChampions'
import Recommendation from '../components/Recommendation'
import Traits from '../components/Traits'
import Compositions from 'components/Compositions'
import ExtraTraits from 'components/ExtraTraits'

import { dataForTraitsAndRecommendation } from '../functions'

import { useState, useRef, useEffect } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { userInfo, userDeck, logoutSelector } from '../recoil/stateAtoms'

import '../css/ChampionsList.css'
import '../css/style.css'
import axios from 'axios'
import Buttons from 'components/Buttons'
const HomeComponent = ({openModal, getChampions, getTraits, saveComposition, getCompositions}) => {
  // to display contents from API when page is opened
  const [displayTraits, setDisplayTraits] = useState([])
  const [displayChampions, setDisplayChampions] = useState({})
  // display currently clicked champion -> [stores name, traits]
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
  const [selectedExtraTrait, setSelectedExtraTrait] = useState({})
  // highlight selected trait
  const [highlightTrait, setHighlightTrait] = useState([])
  
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
console.log('home')
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
    getTraits().then(res=>{
      setDisplayTraits(res.traits)
    }).catch(error=>{
      console.log(error)
    })

    getChampions().then(res=>{
      setDisplayChampions(res.champions)
    }).catch(error=>{
      console.log(error)
      // openModal(error)
    })
  }, [])
  // get champion compositions and save them to localstorage/recoil
  useEffect(() => {
    // for preventing error from refresh.
    if (userRecoil) {
      getCompositions(userRecoil._id).then((res) => {
        setDeckRecoil(res.compositions)
        const jsonString = JSON.stringify(res.compositions)
        localStorage.setItem('compositions', jsonString)
      })
      .catch((error) => {
        console.log(error)
        openModal('no compositions')
        // logout()
      })
    }
  }, [retrieveCompositions, userRecoil])

  // Function to find traits for the selected champion
  const findTraits = (champ, selectedChampionTraits, activation) => {
    // go through array of champions in a trait
    displayTraits.forEach((trait) => {
      Object.values(trait.champions).forEach((champion) => {
        // if champion is found then save the trait and activation indicator
        if (champion[0] === champ) {
          selectedChampionTraits.push(trait.name)
          activation[trait.name] = trait.activation
        }
      })
    })
  }

  // user clicks champion from the list
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
    const cham = displayChampions.filter(
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
        setSelectedExtraTrait({})
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

  // when user clicks reset
  const refreshHandler = () => {
    // delete currently clicked champion
    setDisplayClickedChampion([])
    // delete displayed list of champions
    setChampionSelectedList({})
    // delete selected champion
    setSelectedChampion([])
    // delete all the selected extra traits
    setSelectedExtraTrait({})
    // extra trait box closed
    setDisplayExtraTraits((prev) => ({ ...prev, switch: false }))
    // delete all the saved traits and their activation indicators
    displayactivation.current = {}
    // delete trait history for comparison (Akali)
    traitHistory.current = { 'k/da': [false, 0], 'true damage': [false, 0] }
    // empty selected compositions
    setSelectedComposition('')
    // undo highlighted extra trait selected
    setHighlightTrait([])
  }
  // when user clicks on save button
  const saveHandler = () => {
    if (openDeckInput) {
      // if input is already opened, save composition
      if (!deckName) {
        openModal('Make a name for your composition')
      } else {
        // when saving composition, send extra added traits as well
        saveComposition(userRecoil._id, championSelectedList, deckName, selectedExtraTrait)
        .then((res) => {
          // helper state for displaying updated compositions list
          setRetrieveCompositions(!retrieveCompositions)
          // show modal
          openModal(res.success)
          // remove current composition list of champions
          setChampionSelectedList({})
          setSelectedExtraTrait({})
          setDisplayExtraTraits({ switch: false, traits: {} })
          setSelectedComposition('')
          // remove selected champion's effect from the main list
          setSelectedChampion([])
          setDeckName('')
        })
        .catch((error) => {
          console.log(error)
          openModal(error.response.data.error)
        })
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

  // when user clicks 'add trait' button, display extra traits to add
  const showExtraTraitHandler = () => {
    let synergies = {}
    Object.entries(displayTraits).forEach(([trait, info]) => {
      if (info.activation.length !== 1) {
        synergies[info.name] = [1, info.activation]
      }
    })
    // console.log(displayTraits)
    setDisplayExtraTraits({
      switch: !displayExtraTraits.switch,
      traits: synergies,
    })
  }
  // console.log(championSelectedList)
  showAllTraits = dataForTraitsAndRecommendation(
    championSelectedList,
    displayactivation.current,
    traitHistory,
    selectedExtraTrait
  )
  // console.log(showAllTraits)

  return (
    <>
    <div className='background' style={{ padding: '50px 10%' }}>
        {/* display all champions */}
        <ChampionsList
          onClickHandler={onClickHandler}
          selectedChampion={selectedChampion}
          costArray={costArray}
          displayChampions={displayChampions}
        />
        
        <Buttons userRecoil={userRecoil} deckRecoil={deckRecoil} isMyCompositionsClicked={isMyCompositionsClicked} openDeckInput={openDeckInput} championSelectedList={championSelectedList} compositionInputRef={compositionInputRef} compositionInputRef2={compositionInputRef2} displayCompositionsHandler={displayCompositionsHandler} setDeckName={setDeckName} deckName={deckName} saveHandler={saveHandler} refreshHandler={refreshHandler}/>
         
        {/* display compositions */}
        <Compositions
          displayTraits={displayTraits}
          displayCompositions={displayCompositions}
          displayactivation={displayactivation}
          setChampionSelectedList={setChampionSelectedList}
          setSelectedExtraTrait={setSelectedExtraTrait}
          selectedComposition={selectedComposition}
          setSelectedComposition={setSelectedComposition}
          setSelectedChampion={setSelectedChampion}
          retrieveCompositions={retrieveCompositions}
          setRetrieveCompositions={setRetrieveCompositions}
          openModal={openModal}
          setHighlightTrait={setHighlightTrait}
        />

        {Object.keys(championSelectedList).length !== 0 && (
          <>
          {userRecoil?.username !== 'admin' &&<>
              {/* display extra traits to add */}
            <ExtraTraits
              showExtraTraitHandler={showExtraTraitHandler}
              selectedExtraTrait={selectedExtraTrait}
              displayExtraTraits={displayExtraTraits}
              setSelectedExtraTrait={setSelectedExtraTrait}
              highlightTrait={highlightTrait}
              setHighlightTrait={setHighlightTrait}
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
              recommendTraits={showAllTraits[1]}
              championSelectedList={championSelectedList}
              costArray={costArray}
              displayTraits={displayTraits}
            />
          </>
        )}
      </div>
    </>
  )
}

export default HomeComponent