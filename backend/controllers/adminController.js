const Champion = require('../models/ChampionModel');
const Trait = require('../models/TraitModel');

exports.getChampions = async (req, res, next) => {
  try{
    // populate traits by name
    const champions = await Champion.find().populate('traits', 'name')
    res.json({
      champions
    })
  }catch(err){
    next(err)
  }
};
exports.addChampion = async (req, res, next) => {
  try{
    const {name, cost, traits} = req.body
    if(!(name, cost) && traits){
      return res.status(400).send('All inputs are required')
    }
    const championExists = await Champion.findOne({name})
    if (championExists){
      return res.status(400).send('Champion Exists')
    }else{
      const champion =  await Champion.create({name, cost, traits})
      res.status(201).json({
        success: 'Champion created',
        championCreated: {
          name: champion.name,
          cost: champion.cost,
          traits: champion.traits
        },
      })
    }
  }catch(err){
    next(err)
  }
};

exports.getTraits = async (req, res, next) => {
  try{
    const traits = await Trait.find()
    res.json({
      traits
    })
  }catch(err){
    next(err)
  }
};

exports.addTrait = async (req, res, next) => {
  try{
    const {name, activation} = req.body
    if(!name && activation.length !== 0){
      return res.status(400).send('All inputs are required')
    }
    console.log(name, activation)
    const traitExists = await Trait.findOne({name})
    if (traitExists){
      return res.status(400).send('Trait Exists')
    }else{
      const trait = await Trait.create({name, activation})
      res.status(201).json({
        success: 'Trait created',
        traitCreated: {
          name: trait.name,
          champions: trait.champions,
          activation: trait.activation
        },
      })
    }
  }catch(err){
    next(err)
  }
  
};

exports.updateChampion = async (req, res, next) => {
  try{
    const {name, cost, traits} = req.body
    const champion = await Champion.findById(req.params.id)
    // replace to new data or existing data
    champion.name = name || champion.name
    champion.cost = cost || champion.cost 
    champion.traits = traits || champion.traits 
    await champion.save()
    res.status(201).send({
      success: 'Champion updated'
    })
  }catch(err){
    next(err)
  }
  
};

exports.updateTrait = async (req, res, next) => {
  try{
    const {name, champions, activation} = req.body
    const trait = await Trait.findById(req.params.id)
    // replace to new data or existing data
    trait.name = name || trait.name
    trait.champions = champions || trait.champions
    trait.activation = activation || trait.activation
    await trait.save()
    res.status(201).send({
      success: 'Trait updated'
    })
  }catch(err){
    next(err)
  }
};
exports.deleteChampion = async (req, res, next) => {
  try{
    // const champion = await Champion.findById(req.params.id)
    const result = await Champion.deleteOne({_id: req.params.id})
    if (result.deletedCount > 0){
      res.send("Champion removed");
    }
  }catch(err){
    next(err)
  }
  
};
exports.deleteTrait = async (req, res, next) => {
  try{
    // const champion = await Champion.findById(req.params.id)
    const result = await Trait.deleteOne({_id: req.params.id})
    if (result.deletedCount > 0){
      res.send("Trait removed");
    }
  }catch(err){
    next(err)
  }
  
};

