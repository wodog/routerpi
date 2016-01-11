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
var cors = require('cors');

...

routerpi(options, express_app);

/*
  routerpi({
    host:'http://localhost:3000',
    db: 'mongodb://127.0.0.1/trood'
  }, app);
 /
```

and you can access http://localhost:3001


#### if there is cors question, you need cors panckage dependency.