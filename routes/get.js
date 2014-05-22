'use strict';

var chalk = require('chalk')

module.exports =  function (req, res, next) {
  console.log( chalk.gray('/ GET' ) )

  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'X-Requested-With')


  global.db.find({doctype:req.params.doctype})
    .sort(req.params.orderBy)
    .exec( function (err, docs) {
      if(!err){
        res.send(docs)
        next();
      }
    });
}
