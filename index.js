'use strict'


/**
 * define and dependencies modules.
 */
const path = require('path');
const express = require('express');
const rpiApp = express();
const http = require('http');
const bodyParser = require('body-parser');
const fs = require('fs');

let _options = {};

/**
 * instance of express rpiApp's sets and uses.
 */
rpiApp.set('views', path.join(__dirname, 'views'));
rpiApp.set('view engine', 'ejs');
rpiApp.use(express.static(path.join(__dirname, 'public')));
rpiApp.use(bodyParser.json());
rpiApp.use(bodyParser.urlencoded({
  extended: false
}));


exports = module.exports = function(options) {
  if (!options) {
    throw new Error('please fill the options');
  }

  _options = options;
  fs.writeFileSync(path.join(__dirname, 'config.json'), JSON.stringify(options));

  return function(req, res, next) {
    // if (req.test) {
    //   //TODO
    // }

    next();
  };
};


exports.parse = function(app) {
  const api = require('./proxy/api');
  console.log(_options);
  let version = Date.now();

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
        let fullName = _options.host + path.join(rootName, childName);
        console.log(`_options.host is ${_options.host}`);
        let methodObj = childRouter[j].route.methods;

        //url type
        let type = 'GET';
        for (let k in methodObj) {
          type = k.toLocaleUpperCase();
        }
        console.log(fullName + ' : ' + type);
        api.addApi({
          name: fullName,
          type: type,
          version: version
        }).catch(err => {
          //console.log(err);
          api.updateApiByCondition({
            name: fullName,
            type: type
          }, {
            version: version
          });
        });
      }
    }
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
}


// module.exports = function(options, app) {
//
//   /**
//    * read and write options to config.json
//    */
//   console.log(JSON.stringify(options));
//   fs.writeFileSync(path.join(__dirname, 'config.json'), JSON.stringify(options));
//
//   const api = require('./proxy/api');
//
//   let version = Date.now();
//
//   /**
//    * define name and type
//    */
//   let router = app._router.stack;
//
//
//   for (let i = 0; i < router.length; i++) {
//     if (router[i].name === 'router') {
//       let regexp = router[i].regexp.toString();
//       let rootName = (regexp.substring(3, regexp.indexOf('?')).split('\\')[0]);
//       let childRouter = router[i].handle.stack;
//       for (let j = 0; j < childRouter.length; j++) {
//         let childName = childRouter[j].route.path;
//
//         // url full name
//         let fullName = options.host + path.join(rootName, childName);
//         let methodObj = childRouter[j].route.methods;
//
//         //url type
//         let type = 'GET';
//         for (let k in methodObj) {
//           type = k.toLocaleUpperCase();
//         }
//         console.log(fullName + ' : ' + type);
//         api.addApi({
//           name: fullName,
//           type: type,
//           version: version
//         }).catch(err => {
//           //console.log(err);
//           api.updateApiByCondition({
//             name: fullName,
//             type: type
//           }, {
//             version: version
//           });
//         });
//       }
//     }
//   }
//
//
//
//   rpiApp.get('/', (req, res, next) => {
//     api.getApis().then(data => {
//       console.log(version);
//       res.render('rpi_index', {
//         data: data,
//         title: 'Api Control System',
//         version: version
//       });
//     });
//   });
//   rpiApp.use('/api', require('./routes/api'));
//
//   rpiApp.listen(3001);
// }
