'use strict';

var chalk = require('chalk')

module.exports =  function (req, res, next) {
  console.log( chalk.gray('/ UPDATE' ) )

  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'X-Requested-With')

  global.db.update({_id:req.params.id}, req.body, function (err) {
    if(!err){
      res.send('ok')
      next();
    }
  });
}
