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
        championCreated: champion,
      })
    }
  }catch(err){
    next(err)
  }
};

exports.getTraits = async (req, res, next) => {
  try{
    const traits = await Trait.find().populate('champions','champion')
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
    const traitExists = await Trait.findOne({name})
    if (traitExists){
      return res.status(400).send('Trait Exists')
    }else{
      const trait = await Trait.create({name, activation})
      res.status(201).json({
        success: 'Trait created',
        traitCreated: trait,
      })
    }
  }catch(err){
    next(err)
  }
  
};

exports.updateChampion = async (req, res, next) => {
  try{
    const {name, cost, traits} = req.body
    if(!(name && cost)){
      console.log('no inputs')
      return res.status(400).send('All inputs are required')
    }else{
      const champion = await Champion.findById(req.params.id)
      // replace to new data or existing data
      champion.name = name || champion.name
      champion.cost = cost || champion.cost 
      champion.traits = traits || champion.traits 
      await champion.save()
      next()
    }
  }catch(err){
    next(err)
  }
  
};

// add champion to all the traits in Trait DB
exports.addChampionToTrait = async (req,res,next) =>{
  const {_id, traits} = req.body
  try{
        // first remove champion from all the traits that matches the champion id
        const deleted = await Trait.updateMany({champions: _id}, {$pull: {champions: _id}})
        // if there are traits from client
        if(traits.length > 0){
          // Use updateMany method to add championId to the champions array in all traits
          const result = await Trait.updateMany(
            // traits: [traitId, traitId, traitId, traitId...]
            { _id: { $in: traits } }, // Match traits with the specified IDs of array
            { $addToSet: { champions: _id } } // Add championId to the champions array, $addToSet ensures uniqueness
          )
          if (result.modifiedCount > 0) {
            // At least one trait was updated
            return res.status(201).send({
              success: 'Champion updated'
            })
          } else {
            // No matching traits found
            next({ error: 'No matching traits found' });
          }
        }else{
          // deleted champion from Trait DB
          if (deleted.modifiedCount > 0) {
            return res.status(201).send({
              success: 'Champion updated'
            })
          }else {
            next({ error: 'Could not delete champions from trait' });
          }
        }

  }catch(error){
    next(error)
  }
}
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

