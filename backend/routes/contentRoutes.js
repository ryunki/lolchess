const express = require("express")
const router = express.Router();
const contentController = require('../controllers/contentController');

router.get("/champions", contentController.getChampions)
router.get("/traits", contentController.getTraits)


module.exports = router;