var express = require('express');
var router = express.Router();
var fs = require('fs');

let arr = []
fs.readdir('C://', function(err, items) {
  items.forEach(file => {
    var files = 'C://' + file
    fs.stat(files, (err, stats) => {
      if(err) return
      arr.push({file, size: stats["size"], birthtime: stats['mtime']})
      
    });
  })
});
router.get('/', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept"); 
  res.json(arr)
});

module.exports = router;
