'use strict';

var chalk = require('chalk')

module.exports =  function (req, res, next) {
  console.log( chalk.gray('/ POST' ) )

  var doc = req.body

  global.db.insert(doc, function (err, newDoc) {
    if(!err){
      res.send(newDoc)
      next();
    }
  });
}
