'use strict';

var chalk = require('chalk'),
  fs = require('fs'),
  path = require('path'),
  async = require('async')


module.exports =  function (req, res, next) {
  console.log( chalk.gray('/ GET explorer ' + req.params.path ) )

  var root =  process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE,
    folder = req.params.path,
    fullPath = path.join(root, folder),
    excludeDot = /^([^.][\w\W]+)/,
    folderList = new Array()

  fs.readdir(fullPath, function (err, files){
    if (err){
      throw err
    }

    async.forEach(files,
      function (file, callback){
        if(excludeDot.exec(file)){
          var current = path.join(fullPath, file)
          fs.lstat(current, function (err, stats){
            if(err){
              callback(err)
            }
            if(stats.isDirectory()){
              folderList.push({
                name: file,
                path: folder
              })
            }
            callback(null)
          })
        } else {
          callback(null)
        }
      },
      function(err){
        if(err){
          throw err
        }
        res.send({
          up: path.resolve(folder, '..'),
          content: folderList
        })
        next()
      })
  })
}
