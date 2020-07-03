const express = require('express');
//require express router
const router = express.Router();
//Users route
router.use('/users', require('./users'));
//require and use home controller
const homeController = require('../controllers/home_controller');
router.get('/', homeController.home);

//export router
module.exports = router;
