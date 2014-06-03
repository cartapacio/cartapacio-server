'use strict';

var chalk = require('chalk'),
  Files = require('../utils/fileProcessor')

module.exports =  function (req, res, next) {
  console.log( chalk.gray('/ UPDATE ' + req.params.id ) )

  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'X-Requested-With')

  var doc = req.body

  new Files(doc, function (finalDoc){
    global.db.update({_id:req.params.id}, finalDoc, function (err) {
      if(!err){
        res.send(finalDoc)
        next();
      } else {
        console.log( chalk.red(err) )
      }
    })
  })

  // utils.findKeys(doc, function (err, doc){
  //   if(!err){
  //     global.db.update({_id:req.params.id}, doc, function (err) {
  //       if(!err){
  //         res.send(doc)
  //         next();
  //       }
  //     });
  //   }
  // })

}
