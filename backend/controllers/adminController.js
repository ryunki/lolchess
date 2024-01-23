const Champion = require('../models/ChampionModel');
const Trait = require('../models/TraitModel');

const { hashPassword, comparePasswords } = require('../utils/hashPassword');
const generateAuthToken = require('../utils/generateAuthToken');

const cookieOptions = {
  // This can enhance security by reducing the risk of cross-site scripting (XSS) attacks.
  httpOnly: true,
  //  helps prevent cross-site request forgery (CSRF) attacks
  sameSite: 'strict',
  // the cookie will be sent only over HTTPS connections. It's recommended to use this option when your site is served over HTTPS.
  secure: process.env.NODE_ENV === 'production',
}


exports.getChampion = async (req, res, next) => {
  console.log('hey')
  res.send('get champion')
};
exports.addChampion = async (req, res, next) => {
  console.log('hey')
  try{
    const {name, cost} = req.body
    if(!(name, cost)){
      return res.status(400).send('All inputs are required')
    }
    const championExists = await Champion.findOne({name})
    if (championExists){
      return res.status(400).send('Champion Exists')
    }else{
      const champion = await Champion.create({name, cost})
      res.status(201).json({
        success: 'Champion created',
        championCreated: {
          name: champion.name,
          cost: champion.cost
        },
      })
    }
  }catch(err){
    next(err)
  }
  
};
exports.addTrait = async (req, res, next) => {
  try{
    const {name, champions, activation} = req.body
    if(!name && champions.length !== 0 && activation.length !== 0){
      return res.status(400).send('All inputs are required')
    }
    const traitExists = await Trait.findOne({name})
    if (traitExists){
      return res.status(400).send('Trait Exists')
    }else{
      const trait = await Trait.create({name, champions, activation})
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

