const Champion = require('../models/ChampionModel');
const Trait = require('../models/TraitModel');


exports.getChampions = async (req, res, next) => {
  try{
    // populate traits by name
    const championsArray = await Champion.find().populate('traits', 'name')
    let champions = championsArray.map(champ=>{
      return {
        _id: champ._id,
        name: champ.name,
        cost: champ.cost,
        traits : champ.traits.map(trait=>{
          return trait.name
        })
      }
    })
    res.json({
      champions
    })
  }catch(err){
    next(err)
  }
};

exports.getTraits = async (req, res, next) => {
  try{
    const traits = await Trait.find().populate('champions')
    console.log(traits)
    res.json({
      traits
    })
  }catch(err){
    next(err)
  }
};