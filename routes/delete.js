'use strict';

var chalk = require('chalk')

module.exports =  function (req, res, next) {
  console.log( chalk.gray('/ DELETE' ) )

  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'DELETE')
  res.header('Access-Control-Allow-Headers', 'X-Requested-With')

  global.db.remove({_id:req.params.id}, function (err) {
    if(!err){
      res.send('ok')
      next();
    }
  });
}
