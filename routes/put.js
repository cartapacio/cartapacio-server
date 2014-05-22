'use strict';

var chalk = require('chalk'),
  utils = require('../utils')

module.exports =  function (req, res, next) {
  console.log( chalk.gray('/ UPDATE' ) )

  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'X-Requested-With')

  var doc = req.body

  utils.findKeys(doc, function (err, doc){
    if(!err){
      global.db.update({_id:req.params.id}, doc, function (err) {
        if(!err){
          res.send(doc)
          next();
        }
      });
    }
  })

}