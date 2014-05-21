'use strict';

var chalk = require('chalk'),
  utils = require('../utils')


module.exports =  function (req, res, next) {
  console.log( chalk.gray('/ POST' ) )

  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");

  var doc = req.body

  if(doc.doctype === 'project'){
    utils.handleImages(doc, function (err, doc){
      if(!err){
        global.db.insert(doc, function (err, newDoc) {
          if(!err){
            res.send(newDoc)
            next();
          }
        });
      }
    })
  }

}
