var express = require('express');
var router = express.Router();
var fs = require('fs');

let disk = ['C:/']

router.get('/', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept"); 
  let arr = []
    fs.readdir(disk.join(''), function(err, items) {
      items.forEach((file, index, allFiles) => {
        var files = disk.join('') + '/' +  file
        fs.stat(files, (err, stats) => {
          if(err) return
          arr.push({file, size: stats["size"], birthtime: stats['mtime']})
          console.log("index", index);
          console.log("allFiles", allFiles.length);
          if (index === allFiles.length - 1) {
            res.json(arr)
          }
        });
      })
    });
});

router.post('/folder', function(req, res, next) {
  let path = JSON.parse(req.body.param)
  let newPath = '/' + path.name
  disk.push(newPath)
});

module.exports = router;
