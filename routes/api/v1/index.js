const express = require('express');

const router = express.Router();
//setting up posts
router.use('/posts', require('./posts'));

module.exports = router;
