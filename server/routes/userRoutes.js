
const express = require('express');
const router = express.Router();
const { identifier } = require('../middlewares/identification');
const userController = require('../controllers/userController.js');

router.get('/get-my-followers', identifier, userController.getMyFollowers);

router.put('/follow/:id', identifier, userController.follow);

module.exports = router;
