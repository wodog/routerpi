'use strict'

/**
 * module dependencies
 */
const express = require('express');
const router = express.Router();
const debug = require('debug')('trood:routes/api');
const math = require('../controllers/math');
const user = require('../controllers/user');

/**
 * math route
 */
router.get('/math', math.index);
router.get('/math/add', math.add);
router.get('/math/minus', math.minus);

/**
 * user route
 */
router.get('/user', user.index);
router.get('/user/loginname/:loginname', user.getUserByLoginName);
router.get('/user/save', user.newAndSave);

module.exports = router;