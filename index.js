'use strict'

const api = require('./proxy/api');
const path = require('path');
const express = require('express');


function addRouter(app) {

    /**
     * define name and type
     * @type {Array}
     */
    let router = app._router.stack;
    for (let i = 0; i < router.length; i++) {
        if (router[i].name === 'router') {
            let regexp = router[i].regexp.toString();
            let rootName = (regexp.substring(3, regexp.indexOf('?')).split('\\')[0]);
            let childRouter = router[i].handle.stack;
            for (let j = 0; j < childRouter.length; j++) {
                let childName = childRouter[j].route.path;

                // url full name
                let fullName = path.join(rootName, childName);
                let methodObj = childRouter[j].route.methods;

                //url type
                let type = 'GET';
                for(let k in methodObj){
                    type = k.toLocaleUpperCase();
                }
                console.log(fullName +' : '+type);
                api.addApi({name: fullName, type: type}).catch(err => {
                    console.log(err);
                });
            }
        }
    }
    //console.log(app._router.stack);
    //for (let i = 0; i < router.stack.length; i++) {
    //    let path = router.stack[i].route.path;
    //    //console.log(typeof path);
    //
    //    api.addApi({name: path}).then(data => {
    //
    //    }).catch(err => {
    //        //console.log(err);
    //    });
    //}
    app.set('views', path.join(__dirname, 'views'));
    app.use(express.static(path.join(__dirname, 'public')));
    app.use('/', require('./routes/web'));
    app.use('/api', require('./routes/api'));
}

exports.addRouter = addRouter;