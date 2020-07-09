const express = require('express');
//require express router
const router = express.Router();

const postController = require('../controllers/post_controller');

const passport = require('../config/passport_local_stratergy');

router.post('/create', passport.checkAuthentication, postController.create);

module.exports = router;
