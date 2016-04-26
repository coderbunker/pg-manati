# Manati

REST API for PostgreSQL. Forget ORM!

[![Build Status](https://travis-ci.org/sylvainv/pg-manati.svg?branch=master)](https://travis-ci.org/sylvainv/pg-manati)

## Usage

```javascript
var manati = require('pg-manati');
var app = manati(
  process.env.DATABASE_URL || 'postgres://user@localhost/database', // your database connection string
  'info' // the minumum log level that will be output
);

// Manati uses KoaJS, if you want to extend it to your needs you can use (see http://koajs.com/ for more info)
app.koa.use(function* (next) {
  // add whatever code you want, will be executed first
});

app.init();
app.start(3000);
```
