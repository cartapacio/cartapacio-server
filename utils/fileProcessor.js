'use strict';

var _ = require('lodash'),
  fs = require('fs-extra'),
  path = require('path'),
  slug = require('slug'),
  uuid = require('uuid'),
  chalk = require('chalk')


// try{
//   var config = require('../localConfig.json')
//   console.log( chalk.green('root path: ' + config.path) )
//   outputPath = config.path
// } catch (err) {
//   throw new Error('config file not found')
// }

function writeFile (data, doc) {
  var folder = doc.doctype,
    subFolder = doc.title || doc._id || '',
    type = 'images' //default

  if(data[1] === 'image'){
    type = 'images'
  } else {
    type = 'pdf'
  }

  var fileName = path.join( 'static', type, folder, slug(subFolder), uuid.v1()+'.'+data[2] )

  fs.outputFileSync(path.join(global.folder, fileName), data[4], data[3])

  console.log( chalk.green('written: ' + fileName) )
  return fileName
}


function processImage (key, doc) {
  var regex = /^data:(.*)\/(.*);(.*),(.*)/

  var data = regex.exec(doc[key])
    if(data){
      doc[key] = writeFile(data, doc)
    }
}

function processImages (key, doc) {
  var images = doc[key],
    regex = /^data:(.*)\/(.*);(.*),(.*)/

  _.each(images, function (item){
    _.forOwn(item, function (value, key){
      var data = regex.exec(value)
      if(data){
        item[key] = writeFile(data, doc)
      }
    })
  })
}


function fileProcessor (document, callback) {
    var tester = /(^image)(_[\w\W]+)/

  _.forOwn(document, function (item, key){
    if(tester.exec(key)){
      if(_.isArray(item)){
        processImages(key, document)
      } else {
        processImage(key, document)
      }
    }
  }, this)

  callback(document)
}


module.exports = fileProcessor
