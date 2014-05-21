'use strict';

var async = require('async'),
  fs = require('fs-extra'),
  path = require('path'),
  slug = require('slug'),
  uuid = require('uuid'),
  chalk = require('chalk')


var Utils = {
  handleImages: function(doc, callback){
    var images = doc.images
    var regex = /^data:(.*)\/(.*);(.*),(.*)/

    async.each(images, function (image, next){
      var data = regex.exec(image.file)

      // if the file is new
      if(data){
        var fileName = path.join( 'static', 'images', doc.doctype, slug(doc.title), uuid.v1()+'.'+data[2] )

        fs.outputFile(path.join(global.folder, fileName), data[4], data[3], function (err){
          if(err){
            next(err)
          }
          image.file = fileName
          next(null)
        })
      } else {
        // leave the field in the doc unmodified
        next(null)
      }
    },
     function (err){
      if(err){
        console.log( chalk.red('error writting image: '  + err) )
        callback(err, null)
      } else {
        callback(null, doc)
      }
     }
    )
  }
}

module.exports = Utils
