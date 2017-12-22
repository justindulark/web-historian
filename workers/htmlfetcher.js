// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.
var fs = require('fs');

var archive = require('../helpers/archive-helpers');

var urlsToFetch = [];

archive.readListOfUrls(function(urlsList) {
  urlsList.forEach(function(url) {
    archive.isUrlArchived(url, function(exists) {
      if (!exists) {
        urlsToFetch.push(url);
        archive.downloadUrls(urlsToFetch);
        console.log(urlsToFetch);
      }
    });
  });
});

