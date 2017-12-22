// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.
var fs = require('fs');

var archive = require('../helpers/archive-helpers');

archive.readListOfUrls(function(urlsList) {
  urlsList.forEach(function(url) {
    archive.isUrlArchived(url, function(exists) {
      if (!exists) {
        //cehck what url starts with
        if (url.startsWith('http://')) {
          url = url.slice(7);
        }
        if (url.startsWith('www.')) {
          url = url.slice(4);
        }
        archive.downloadUrls(url);
        console.log(url);
      }
    });
  });
});

