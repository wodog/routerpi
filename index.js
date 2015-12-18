'use strict'

const api = require('./proxy/api');
const path = require('path');
const express = require('express');
const rpiApp = express();
const http = require('http');
const bodyParser = require('body-parser');


rpiApp.set('views', path.join(__dirname, 'views'));
rpiApp.set('view engine', 'ejs');
rpiApp.use(express.static(path.join(__dirname, 'public')));
rpiApp.use(bodyParser.json());
rpiApp.use(bodyParser.urlencoded({extended: false}));

let version = Date.now();

rpiApp.get('/', (req, res, next) => {
    api.getApis().then(data => {
        console.log(version);
        res.render('rpi_index', {data: data, title: 'Api Control System', version: version});
    });
});
rpiApp.use('/api', require('./routes/api'));

rpiApp.listen(3001);

//http.createServer(rpiApp).listen(3005);


module.exports = function (host, app) {
    /**
     * define name and type
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
                let fullName = host + path.join(rootName, childName);
                let methodObj = childRouter[j].route.methods;

                //url type
                let type = 'GET';
                for (let k in methodObj) {
                    type = k.toLocaleUpperCase();
                }
                console.log(fullName + ' : ' + type);
                api.addApi({name: fullName, type: type, version: version}).catch(err => {
                    //console.log(err);
                    api.updateApiByCondition({name: fullName, type: type}, {version: version});
                });
            }
        }
    }
}
