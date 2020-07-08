const express = require('express');
//require express router
const router = express.Router();

const postController = require('../controllers/post_controller');

router.post('/create', postController.create);

module.exports = router;
