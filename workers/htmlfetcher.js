// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.

var archive = require('../helpers/archive-helpers');

var urls = [];
var urlsToFetch = [];

archive.readListOfUrls(function(urlsList) {
  urls = urlsList;
});

urls.forEach(function(url) {
  archive.isUrlArchived(url, function(exists) {
    if (!exists) {
      urlsToFetch.push(url);
    }
  });
});

archive.downloadUrls(urlsToFetch);
