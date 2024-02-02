// @ts-nocheck

import '../css/ChampionsList.css'
import '../css/style.css'
import axios from 'axios'
import HomeComponent from './HomeComponent'
const Home = ({openModal}) => {
  const getChampions= async () => {
    const {data} = await axios.get('/api/content/champions')
    return data
  }
  // get traits to display when user clicks champion  
  const getTraits = async () => {
    const {data} = await axios.get('/api/content/traits')
    return data
  }
  // get champion compositions and save them to localstorage/recoil
  const getCompositions = async (id) => {
    const {data} = await axios.get(`/api/users/compositions/${id}`)
    return data
  }
  const saveComposition = async (userId, championSelectedList, deckName, selectedTrait) =>{
    const {data} = await axios.post('/api/users/composition', {userId,championSelectedList, deckName, selectedTrait})
    return data
  }

  return (
    <>
      <HomeComponent openModal={openModal} getChampions={getChampions} getTraits={getTraits} saveComposition={saveComposition} getCompositions={getCompositions}/>
      {/* <HomeComponent openModal={openModal} getChampions={getChampions} getTraits={getTraits} getCompositions={getCompositions}/> */}
    </>
  )
}

export default Home
