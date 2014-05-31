'use strict';

var chalk = require('chalk'),
  fs = require('fs-extra'),
  path = require('path'),
  async = require('async'),
  Database = require('../database')


module.exports =  function (req, res, next) {
  console.log( chalk.gray('/ POST saveDbPath' ) )

  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'X-Requested-With')

  var folder = req.body.path,
    root =  process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE,
    fullPath = path.join(root, folder, 'website'),
    configFile = path.join(__dirname, '..', 'localConfig.json')

  async.waterfall([
    function (next){
      fs.ensureDir(fullPath, function (err){
        if(err){
          next(err)
        }
        new Database(fullPath)
        next()
      })
    },
    function (next){
      fs.outputFile(configFile, JSON.stringify({path:fullPath}), function (err){
        if(err){
          next(err)
        }
        next()
      })
    }
    ],
    function (err){
      if(err){
        throw err
      }
      res.send({status: 200, path: configFile})
      next()
  })
}
