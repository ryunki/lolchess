// @ts-nocheck
import { useState, useEffect } from 'react';
import {synergy } from '../constants';

const Recommendation = ({dataForRecommendation, championSelectedList, recommendChamp, setRecommendChamp}) => {
  //  dataForRecommendation
  // 1: [trait1,trait2,trait3]
  // 2: [trait1,trait2,trait3]

  useEffect(()=>{
    const data = Object.entries(dataForRecommendation)
    // 0: ['1' , [trait1,trait2]]
    // 1: ['2' , [trait1,trait2]]
      if(data.length > 0){
        // for storing the list of champions
        var recommendedChampionsList = []
        // check if the inactivated trait exists
        if(data[0][1]){
          // loop through the champ list of inactivated traits with difference of 1
          data[0][1].forEach(trait=>{
            // find all the champions that meets the trait 
            Object.keys(synergy.classes).forEach(clas => {
              if(trait === clas ){
                recommendedChampionsList = [...recommendedChampionsList, ...synergy.classes[clas].champs]
              }
            })
            Object.keys(synergy.origins).forEach(orig => {
              if(trait === orig ){
                recommendedChampionsList = [...recommendedChampionsList, ...synergy.origins[orig].champs]
              }
            })
          })
        }
        // store list of selected champions
        var selectedChampions = []
        // extract the names only
        const champList = Object.keys(championSelectedList)
        champList.forEach(champ =>{
          selectedChampions.push(champ)
        })
        // remove list of selected champions from the recommend list
        const filteredChamps = recommendedChampionsList.filter(champ => !selectedChampions.includes(champ))
        // count how many traits to be activated for one champion
        // by counting the duplicate names
        const finalChampList = filteredChamps.reduce((counts,el)=>{
          counts[el] = (counts[el] || 0) + 1
          return counts
        },{})
        // sort them high to low 
        const sorted = Object.entries(finalChampList).sort((a,b)=>{
          return b[1] - a[1]
        })
        setRecommendChamp(sorted)
}},[dataForRecommendation,setRecommendChamp,championSelectedList])
  
  return (<>
    <div>Recommendation</div>
    {recommendChamp && Object.entries(recommendChamp).map((item, idx) => {
      return <div key={idx}> {item[1][0]} ({item[1][1]})</div>
    })}
  </>
  )
}

export default Recommendation