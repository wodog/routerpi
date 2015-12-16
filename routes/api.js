'use strict'

/**
 * module dependencies
 */
const express = require('express');
const router = express.Router();
const debug = require('debug')('trood:routes/api');
const api = require('../proxy/api');
const result = require('../common/result');


router.get('/asd', (req, res) => {
});

/**
 * api route
 */
router.get('/', (req, res, next) => {
    //debug(req.query);
    if (req.query.id) {
        debug(req.query.id);
        api.getApiById(req.query.id).then(data => {
            debug(req.query);
            res.json(new result(true, data));
        }).catch(err => {
            res.json(new result(false, err));
        });
    } else {
        api.getApis().then(data => {
            res.json(new result(true, data));
        }).catch(err => {
            res.json(new result(false, err));
        });
    }

});
router.get('/add', (req, res, next) => {
    debug('addApi:query: ', req.query);
    api.addApi(req.query).then(data => {
        res.json(new result(true, data));
    }).catch(err => {
        res.json(new result(false, err));
    });
});
router.get('/delete', (req, res, next) => {
    debug('remnoveApi:query: ', req.query);
    api.removeApi(req.query).then(data => {
        res.json(new result(true, data));
    }).catch(err => {
        res.json(new result(false, err));
    });
});
router.post('/update', (req, res, next) => {
    debug('updateApi:query', req.query);
    debug('updateApi:body', req.body);
    api.updateApi(req.query.id, req.body).then(data => {
        res.json(new result(true, data));
    }).catch(err => {
        res.json(new result(false, err));
    });
});

/**
 * exports
 */
module.exports = router;
