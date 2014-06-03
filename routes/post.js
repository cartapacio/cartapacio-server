'use strict';

var chalk = require('chalk'),
  Files = require('../utils/fileProcessor')


module.exports =  function (req, res, next) {
  console.log( chalk.gray('/ POST' ) )

  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With');

  var doc = req.body

  new Files(doc, function (finalDoc){
    global.db.insert(finalDoc, function (err, newDoc) {
      if(!err){
        res.send(newDoc)
        next();
      } else {
        console.log( chalk.red(err) )
      }
    })
  })

  // utils.findKeys(doc, function (err, doc){
  //   if(!err){
  //     global.db.insert(doc, function (err, newDoc) {
  //       if(!err){
  //         res.send(newDoc)
  //         next();
  //       } else {
  //         console.log( chalk.red(err) )
  //       }
  //     });
  //   } else {
  //     console.log( chalk.red(err) )
  //   }
  // })

}
