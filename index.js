'use strict';


const path = require('path');
const express = require('express');
const rpiApp = express();
const http = require('http');
const bodyParser = require('body-parser');
const fs = require('fs');
const _ = require('underscore');


rpiApp.set('views', path.join(__dirname, 'views'));
rpiApp.set('view engine', 'ejs');
rpiApp.use(express.static(path.join(__dirname, 'public')));
rpiApp.use(bodyParser.json());
rpiApp.use(bodyParser.urlencoded({
  extended: false
}));



//http.createServer(rpiApp).listen(3005);


module.exports = function(options, app) {

  /**
   * read and write options to config.json
   */
  console.log(JSON.stringify(options));
  fs.writeFileSync(path.join(__dirname, 'config.json'), JSON.stringify(options));

  const api = require('./proxy/api');

  let version = Date.now();

  /**
   * define name and type
   */
  let routers = app._router.stack;

  // 遍历 app._router.stack
  _.forEach(routers, function(router, index) {
    let apiName = '';
    let methodName = '';

    if (router.name === 'router') {
      let regexp = router.regexp.toString();
      let rootName = (regexp.substring(3, regexp.indexOf('?')).split('\\')[0]);
      let childRouters = router.handle.stack;

      // 遍历 app._router.stack.name为router的 .handle.stack 即 app._router.stack.name.handle.stack
      _.forEach(childRouters, function(childRouter, index) {
        let childName = childRouter.route.path;

        if (typeof childName === 'object') {
          childName = childName.join('/');
        }

        // 获取 api name
        apiName = options.host + path.join(rootName, childName);
        // 获取 method name
        methodName = childRouter.route.stack[0].method.toUpperCase();
      });
    } else if (router.name === 'bound dispatch') {
      if (typeof router.route.path === 'object') {
        apiName = options.host + path.join(router.route.path.join('/'));
      } else {
        apiName = options.host + path.join(router.route.path);
      }

      methodName = router.route.stack[0].method.toUpperCase();
    }

    // 加入到数据库中或者更新
    addApiOrUpdateApi(apiName, methodName);
  });

  /**
   * add or update
   */
  function addApiOrUpdateApi(apiName, methodName) {
    api.addApi({
      name: apiName,
      type: methodName,
      version: version
    }).catch(function(err) {
      // console.log(err);
      api.updateApiByCondition({
        name: apiName,
        type: methodName
      }, {
        version: version
      });
    });
  }



  rpiApp.get('/', (req, res, next) => {
    api.getApis().then(data => {
      console.log(version);
      res.render('rpi_index', {
        data: data,
        title: 'Api Control System',
        version: version
      });
    });
  });
  rpiApp.use('/api', require('./routes/api'));

  rpiApp.listen(3001);
};