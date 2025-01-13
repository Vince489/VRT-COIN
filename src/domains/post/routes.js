const express = require('express');
const router = express.Router();

const userRoutes = require('../domains/user/routes');
const postRoutes = require('../domains/post/routes');

router.use('/users', userRoutes);
router.use('/posts', postRoutes); // Add post routes

module.exports = router;
