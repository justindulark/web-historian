var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var request = require('request');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};
// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!
// fs.readFile('/etc/passwd', (err, data) => {
//   if (err) throw err;
//   console.log(data);
// });
exports.readListOfUrls = function(callback) {
  fs.readFile(exports.paths.list, 'utf8', (err, data) => {
    if (err) {          
      throw err;
    }
    callback(data.split('\n'));
  });
};

exports.isUrlInList = function(url, callback) {
  fs.readFile(exports.paths.list, 'utf8', (err, data) => {
    if (err) {
      throw err;
    }
    callback(data.split('\n').indexOf(url) !== -1);
  });
};

exports.addUrlToList = function(url, callback) {
  //needs to be entered with a new line, write test about this
  fs.appendFile(exports.paths.list, url + '\n', (err) => {
    if (err) {
      throw err;
    }
    callback('done');
  });
};

exports.isUrlArchived = function(url, callback) {
  fs.access(exports.paths.archivedSites + '/' + url, (err) => {
    callback(err ? false : true);
  });
};

exports.downloadUrls = function(url) {
  request('http://www.' + url, function(error, response, body) {
    fs.writeFile(exports.paths.archivedSites + '/' + url, body.toString('utf8'), (err) => {
      if (err) {
        throw err;
      }
    });
  });
};


