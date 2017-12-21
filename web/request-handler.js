var path = require('path');
var archive = require('../helpers/archive-helpers');
var httphelp = require('../web/http-helpers.js');
// require more modules/folders here!

exports.handleRequest = function (req, res) {
  if (req.method === 'POST') {
    var result = '';
    req.on('data', (chunk) => { result += chunk; });
    req.on('end', () => { 
      //slice off the 'url=' at the front of the string, leaving only the url itself
      result = result.slice(4);
      archive.isUrlArchived(result, function(exists) {
        if (exists) {
          //jquery is client side, find node way to change html
          httphelp.serveAssets(res, result);
        } else {
          if (!archive.isUrlInList(result)) {
            archive.addUrlToList(result);
          }
          res.writeHead(302, httphelp.headers);
          res.end(archive.paths.list);

        }
      });
    }); 

  }
  if (req.method === 'GET') {
  }
  //res.end(archive.paths.list);
};
