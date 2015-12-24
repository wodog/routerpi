## About this

This is a solution to resolve express router api generate.

## How use

install routerpi in your express program.

```bash
npm install --save routerpi
```

add below code in your app.js

```javascript
var routerpi = require('routerpi');

app.use(routerpi(
  (options)
));

//....

routerpi.parse(app);

/*
 * options = {
 *   host:'http://localhost:3000',
 *   db: 'mongodb://121.42.62.149:32769/troo'
 * };
 */
```

and you can access http://localhost:3001


#### if there is cors question, you need cors panckage dependency.
