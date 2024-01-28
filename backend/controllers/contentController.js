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
        traits : champ.traits.map(trait=>trait.name),
        // traitsInfo: champ.traits
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
    const traits = await Trait.find().populate('champions','name')
    // re arranging data for frontend
    const newTraits = traits.map((trait) => ({
      _id: trait._id,
      name: trait.name,
      champions: trait.champions.map((item) => item.name),
      activation: trait.activation,
    }));
    res.json({traits:newTraits})
  }catch(err){
    next(err)
  }
};