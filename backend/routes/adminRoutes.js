const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const {verifyIsAdmin, verifyIsLoggedin} = require("../middleware/verifyAuthToken")
router.use(verifyIsLoggedin)
router.use(verifyIsAdmin)
// Define admin-related routes
router.get('/champions', adminController.getChampions);
router.post('/champion', adminController.addChampion);
router.get('/traits', adminController.getTraits);
router.post('/trait', adminController.addTrait);
router.put('/champion/:id', adminController.updateChampion);
router.put('/trait/:id', adminController.updateTrait);
router.delete('/champion/:id', adminController.deleteChampion);
router.delete('/trait/:id', adminController.deleteTrait);

module.exports = router;