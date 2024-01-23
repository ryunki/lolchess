const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Define admin-related routes

router.get('/', adminController.getChampion);
router.post('/champion', adminController.addChampion);
router.post('/trait', adminController.addTrait);
router.put('/champion/:id', adminController.updateChampion);
router.put('/trait/:id', adminController.updateTrait);
router.delete('/champion/:id', adminController.deleteChampion);
router.delete('/trait/:id', adminController.deleteTrait);

module.exports = router;