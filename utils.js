'use strict';

var async = require('async'),
  fs = require('fs-extra'),
  path = require('path'),
  slug = require('slug'),
  uuid = require('uuid'),
  chalk = require('chalk')


var Utils = {
  findKeys: function(doc, callback){
    this.doc = doc
    this.callback = callback

    this.regex = /^data:(.*)\/(.*);(.*),(.*)/

    if('images' in this.doc){
      this.projectImages()
    } else if('portrait' || 'full_cv' in this.doc){
      this.cvFiles()
    } else {
      this.callback(null, doc)
    }
  },
  projectImages: function(){
    var images = this.doc.images,
      self = this

    async.each(images, function (image, next){

      var data = self.regex.exec(image.file)

      // if the file is new
      if(data){
        var fileName = path.join( 'static', 'images', self.doc.doctype, slug(self.doc.title), uuid.v1()+'.'+data[2] )

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
        self.callback(err, null)
      } else {
        self.callback(null, self.doc)
      }
     }
    )
  },
  cvFiles: function(){
    var portrait = this.doc.portrait,
      cv = this.doc.full_cv,
      self = this

    async.parallel([
      function (next){
        var data = self.regex.exec(portrait)
        if(data){
          var fileName = path.join( 'static', 'images', self.doc.doctype, uuid.v1()+'.'+data[2] )

          fs.outputFile(path.join(global.folder, fileName), data[4], data[3], function (err){
            if(err){
              next(err)
            }
            self.doc.portrait = fileName
            next(null)
          })
        } else {
          // leave the field in the doc unmodified
          next(null)
        }
      },
      function (next){
        var data = self.regex.exec(cv)
        if(data){
          var fileName = path.join( 'static', 'pdf', self.doc.doctype, 'full_cv.'+data[2] )

          fs.outputFile(path.join(global.folder, fileName), data[4], data[3], function (err){
            if(err){
              next(err)
            }
            self.doc.full_cv = fileName
            next(null)
          })
        } else {
          // leave the field in the doc unmodified
          next(null)
        }
      }
    ], function (err){
      if(err){
        console.log( chalk.red('error writting file: '  + err) )
        self.callback(err, null)
      } else {
        self.callback(null, self.doc)
      }
    })
  }
}

module.exports = Utils
