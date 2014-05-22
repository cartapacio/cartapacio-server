'use strict';

var chalk = require('chalk'),
  utils = require('../utils')


module.exports =  function (req, res, next) {
  console.log( chalk.gray('/ POST' ) )

  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");

  var doc = req.body

  utils.handleImages(doc, function (err, doc){
    if(!err){
      global.db.insert(doc, function (err, newDoc) {
        if(!err){
          res.send(newDoc)
          next();
        } else {
          console.log( chalk.red(err) )
        }
      });
    } else {
      console.log( chalk.red(err) )
    }
  })

}
