'use strict';

var chalk = require('chalk')

module.exports =  function (req, res, next) {
  console.log( chalk.gray('/ GET build' ) )

  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'X-Requested-With')


  res.send({status: 'to implement'})
}
