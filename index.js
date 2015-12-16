'use strict'

const api = require('./proxy/api');
const path = require('path');
const express = require('express');

function addRouter(app, router) {
    for (let i = 0; i < router.stack.length; i++) {
        let path = router.stack[i].route.path;
        //console.log(typeof path);

        api.addApi({name: path}).then(data => {

        }).catch(err => {
            //console.log(err);
        });
    }
    app.set('views', path.join(__dirname, 'views'));
    app.use(express.static(path.join(__dirname, 'public')));
    app.use('/', require('./routes/web'));
    app.use('/api', require('./routes/api'));
}

exports.addRouter = addRouter;