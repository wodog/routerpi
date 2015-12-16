'use strict'

/**
 * module dependencies
 */
const mongoose = require('mongoose');
const config = require('../config');
const debug = require('debug')('trood:models/index')

/**
 * connect to db
 */
mongoose.connect(config.db, (err) => {
    if (err) {
        debug('connect to %s error:', config.db, err.message);
        process.exit(1);
    }
    debug('connect to mongoodb success');
});

/**
 * exports
 */
exports.Api = require('./api');
