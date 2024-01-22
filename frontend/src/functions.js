
export const specialFunctionAkali = (sameValue, inActivated, inactivatedCat, activatedCat, traitHistory, kdaIsLower, kda, td) => {
  // if both traits have same value
  if(sameValue){
    // if one trait is activated only
    if(inActivated.length === 1){
      // deduct 1 from inactivated trait
      inactivatedCat[inActivated][0] += -1
      // update trait history
      Object.entries(traitHistory.current).forEach(([trait,value])=>{
        inactivatedCat[trait] && (traitHistory.current[trait][1] = inactivatedCat[trait][0])
      })
    }
    // if both traits are activated
    else if(inActivated.length === 0){
      // compare history value
      // traitHistory
      if(traitHistory.current[kda] < traitHistory.current[td]){
        // it means kda was add in the last time, deduct 1 from td
        activatedCat[td][0] += -1
      }
      if(traitHistory.current[kda] > traitHistory.current[td]){
        // it means kda was add in the last time, deduct 1 from td
        activatedCat[kda][0] += -1
      }
      // update trait history
      Object.entries(traitHistory.current).forEach(([trait,value])=>{
        activatedCat[trait] && (traitHistory.current[trait][1] = activatedCat[trait][0])
      })
    }
  }
  // if both traits have different value
  else {
    // if one trait is activated only
    if(inActivated.length === 1){
      // deduct 1 from inactivated trait
      inactivatedCat[inActivated][0] += -1
    }
    // if both traits are activated
    else if(inActivated.length === 0){
      // deduct 1 from lower valued trait
       kdaIsLower ?activatedCat[kda][0] += -1 : activatedCat[td][0] += -1
    }
    // update trait history
    Object.entries(traitHistory.current).forEach(([trait,value])=>{
      activatedCat[trait] && (traitHistory.current[trait][1] = activatedCat[trait][0])
    })
  }
}


 export const sortTraits = (collectTraits, championSelectedList, traitHistory ) => {
    let kda = 'k/da'
    let td = 'true damage'
    // to store and group by the trait results by activated or inactivated
    let activatedCategories = [];
    let inactivatedCategories = [];

    let currentAkali = { 'k/da': [false, 0], 'true damage': [false, 0] }

    Object.entries(collectTraits).forEach(([trait, value]) => {
 
      // check if the the current trait equals or greater than any number of the activation array
      const activated = value[1].some((num) => {
        // update kda or trueDamage's current state
        if (trait === kda || trait === td) {
          if (value[0] >= num){
            currentAkali[trait][0] = true;
            currentAkali[trait][1] = value[0];
          }else{
            currentAkali[trait][0] = false;
            currentAkali[trait][1] = value[0];
          }
        }
        return value[0] >= num;
      });
     
      // group them by activated and inactivated
      activated ? activatedCategories.push([trait, value]) : inactivatedCategories.push([trait, value])
    });
    
    let activatedCat = Object.fromEntries(activatedCategories);
    let inactivatedCat = Object.fromEntries(inactivatedCategories);
    // extract inactivated trait for akali
    const inActivated = Object.keys(currentAkali).filter((trait) => currentAkali[trait][0] === false)
    // const activated = Object.keys(currentAkali).filter((trait) => currentAkali[trait][0] === true)
    const sameValue = currentAkali[kda][1] === currentAkali[td][1]
    const kdaIsLower = currentAkali[kda][1] < currentAkali[td][1]
    // if the list includes Akali
    if(championSelectedList['Akali']){
      // eslint-disable-next-line no-sequences
      specialFunctionAkali(sameValue, inActivated, inactivatedCat, activatedCat, traitHistory, kdaIsLower, kda, td)
    }else{
      // if both values are different
      if (!sameValue){
        // if both traits are inactivated
        if(inActivated.length === 2){
          // update trait history
          Object.entries(traitHistory.current).forEach(([trait,value])=>{
            inactivatedCat[trait] && (traitHistory.current[trait][1] = inactivatedCat[trait][0])
          })
        }
    }
  }
    // update inactivated categories
    inactivatedCategories = Object.entries(inactivatedCat)
// filter inactivated trait
    const filteredTraitFromAct = Object.entries(activatedCat).filter(item => item[1][0] < item[1][1][0])
    // if inactivated trait exists in activatedCategories, move it to inactivatedCategories
    // this happens because of AKALI's special logic for deducting traits
    if(filteredTraitFromAct.length !== 0){
      const filteredTraitFromActCorrect = Object.entries(activatedCat).filter(item => item[1][0] >= item[1][1][0])
      activatedCategories = filteredTraitFromActCorrect
      inactivatedCategories = [...inactivatedCategories, filteredTraitFromAct[0]]
    }
    // this variable is for saving inactivated traits and re-arrange them by diffence as {difference: [trait, trait2...]}
    let traitDifference = {};
    let sortedInactivatedCategories = [];
    if (inactivatedCategories.length > 1) {
      // Sort inactivated categories by differences by low to high
      // array( ['trait1',[1, [2,4,6,8]]], ['trait2',[1, [2,4,6,8]]] )
      sortedInactivatedCategories = inactivatedCategories.sort((a, b) => {
        // a[0] is the name of trait
        // a[1][0] is the current value of trait
        // aa[1][1][0] is the first number of activation indicator array
        // calculate the differences needed to be activated
        const differenceA = Math.abs(a[1][0] - a[1][1][0]);
        const differenceB = Math.abs(b[1][0] - b[1][1][0]);
        // save the differences to corresponding name of trait
        traitDifference[a[0]] = differenceA;
        traitDifference[b[0]] = differenceB;
        // If differences are not equal, Sort by least differences from low to high
        if (differenceA !== differenceB) {
          return differenceA - differenceB;
        }
        // If differences are equal, sort values by high to low
        return b[1][0] - a[1][0];
      });
      // because sort() won't work with length of 1
    } else if (inactivatedCategories.length === 1) {
      const cat = inactivatedCategories[0];
      const difference = Math.abs(cat[1][0] - cat[1][1][0]);
      traitDifference[cat[0]] = difference;
      sortedInactivatedCategories = inactivatedCategories;
    }
    
    // from {trait: 1, trait2: 1, trait3: 2 ...}
    // re-arrange the trait differences to {1:[name of traits], 2:[name of traits]}

    const traitDifferenceList = Object.entries(traitDifference).reduce(
      (acc, [key, value]) => {
          if (!acc[value]) {acc[value] = [];}
          acc[value].push(key);
        return acc;
      },{});
      // Sort activated categories by value from high to low
    const sortedActivatedCategories = activatedCategories.sort((a, b) => {
      // Prioritize categories with activation array length of 1 at the top (for 5 cost champion's synergy)
      if (a[1][1].length === 1 && b[1][1].length !== 1) return -1 // put first item before the second item
      if (b[1][1].length === 1 && a[1][1].length !== 1) return  1  // put second item before the first item
      return (b[1][0] - a[1][0]) // sort values by high to low
  });

    // refilter because there is a case where kda/trueDamage is inactivated but included in activatedCategories
    // filter out inactivated kda/trueDamage from  sortedActivatedCategories

    const newSortedActivatedCategories = sortedActivatedCategories.filter(item=>{
      if(item[1][1].length === 1) return true //for cost 5 champions
        return item[1][1].some(num => {return item[1][0] >= num})
      })
    // extract inactivated kda/trueDamage from sortedActivatedCategories
    const takeaway = sortedActivatedCategories.filter(item=>{
      if(item[1][1].length === 1) return false //for cost 5 champions
        return !item[1][1].some(num =>  item[1][0] >= num)
    })
    
    // Combine sorted activated and inactivated categories
    const sortedData = newSortedActivatedCategories.concat(sortedInactivatedCategories.concat(takeaway));
  
    return {sortedData, traitDifferenceList};
    
}

export const dataForTraitsAndRecommendation = (championSelectedList, displayActivation, traitHistory, selectedTrait, saveTraits) => {

  let collectTraits = {};
  // remove duplicate traits and add up those number of accumulated traits and sorting from high to low
  Object.values(championSelectedList).forEach((champ) => {
    champ.traits.forEach((trait) => {
      collectTraits[trait] = (collectTraits[trait] || 0) + 1;
    });
  });
    // attach array of activation indicator to corresponding traits
    Object.keys(collectTraits).forEach((trait) => {
      if (displayActivation[trait]) {
        collectTraits[trait] = [collectTraits[trait], displayActivation[trait]];
      }
    });
    // ***************************************
    // this is for adding extra trait (selected) to synergy 
    // ***************************************
    Object.entries(selectedTrait).forEach(([trait,value])=>{
      collectTraits[trait] = [collectTraits[trait] ? collectTraits[trait][0] + value[0] : value[0], value[1]]
    })

    // sort the traits in order, and get inactivated traits list
    const {sortedData, traitDifferenceList} = sortTraits(collectTraits, championSelectedList, traitHistory);
    // Convert back to object
    const sortedObject = Object.fromEntries(sortedData);

    return [sortedObject, traitDifferenceList]
}