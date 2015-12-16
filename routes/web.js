'use strict'

const express = require('express');
const router = express.Router();
const config = require('../config');
const api = require('../proxy/api');

/**
 * apis index
 */
router.get('/', (req, res, next) => {
    api.getApis().then(data => {
       res.render('rpi_index', {data:data, title: 'Api Control System'});
    });
});


module.exports = router;
