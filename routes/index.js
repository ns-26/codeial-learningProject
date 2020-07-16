const express = require('express');
//require express router
const router = express.Router();

//Users route
router.use('/users', require('./users'));
//posts route
router.use('/posts', require('./posts'));
//comments route
router.use('/comments', require('./comments'));
//setting up api section
router.use('/api', require('./api'));

//require and use home controller
const homeController = require('../controllers/home_controller');
router.get('/', homeController.home);

//export router
module.exports = router;
