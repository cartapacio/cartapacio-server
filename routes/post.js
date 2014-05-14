'use strict';

var chalk = require('chalk')

module.exports =  function (req, res, next) {
  console.log( chalk.gray('/ POST' ) )

  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");

  var doc = req.body

  global.db.insert(doc, function (err, newDoc) {
    if(!err){
      res.send(newDoc)
      next();
    }
  });
}
