var path = require('path');
var archive = require('../helpers/archive-helpers');
var httpHelp = require('../web/http-helpers.js');
var fs = require('fs');
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
          httpHelp.serveAssets(res, result, 302);
        } else {
          if (!archive.isUrlInList(result)) {
            archive.addUrlToList(result);
          }
          fs.readFile(archive.paths.siteAssets + '/loading.html', 'utf8', (err, data) => {
            if (err) {
              throw err;
            }
            res.writeHead(302, httpHelp.headers);
            res.end(data);
          });
        }
      });
    }); 

  }
  if (req.method === 'GET') {
    if (req.url === '/styles.css') {
      console.log('req url is styles.css');
      fs.readFile(archive.paths.siteAssets + '/styles.css', 'utf8', (err, data) => {
        if (err) {
          throw err;
        }
        var cssHeader = {
          'access-control-allow-origin': '*',
          'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'access-control-allow-headers': 'content-type, accept',
          'access-control-max-age': 10, // Seconds.
          'Content-Type': 'text/css'
        };

        res.writeHead(200, cssHeader);
        res.end(data);
      });
    } else if (req.url === '/request-handler.js') {
      fs.readFile(__dirname + '/request-handler.js', 'utf8', (err, data) => {
        if (err) {
          throw err;
        }
        var jsHeader = {
          'access-control-allow-origin': '*',
          'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'access-control-allow-headers': 'content-type, accept',
          'access-control-max-age': 10, // Seconds.
          'Content-Type': 'application/javascript'
        };

        res.writeHead(200, httpHelp.headers);
        res.end(data);
      });
    } else if (req.url === '/') {
      fs.readFile(archive.paths.siteAssets + '/index.html', 'utf8', (err, data) => {
        if (err) {
          throw err;
        }
        res.writeHead(200, httpHelp.headers);
        res.end(data);
      });
    } else {
      archive.isUrlArchived(req.url.slice(1), function(exists) {
        if (exists) {
          httpHelp.serveAssets(res, req.url.slice(1), 200);
        } else {
          res.writeHead(404, httpHelp.headers);
          res.end();
        }
      });
    }
  }
};
