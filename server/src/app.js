const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const fs = require('fs');

const app = express()
app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(cors())

let disk = ['C:/']

app.post('/folder', function(req, res, next) {
  if(req.body.path) {
    let newPath = '/' + req.body.path
    disk.push(newPath)
  }
  // if(req.body.path) {
  //   let newPath = '/' + req.body.path
  //     if(fs.lstatSync(disk.join('') + newPath).isDirectory()) disk.push(newPath) 
  //     else {
  //       fs.readFile(disk.join('') + newPath, "utf8", 
  //       function(error,data){
  //         if(error) return;
  //         res.send(data)
  //       });
  //     }
  // }
    
    let arr = []
    fs.readdir(disk.join(''), function(err, items) {
      if(err) {
        disk.pop();
        return
      }
      items.forEach((file, index, allFiles) => {
        var files = disk.join('') + '/' +  file;
        fs.stat(files, (err, stats) => {
          if(err) return err
          arr.push({file, size: stats["size"], birthtime: stats['mtime']})
          if (index === allFiles.length - 1) {
            res.send(arr)
          }
        });
      })
    });
});

app.get('/return', function(req, res, next) {
  if(disk.length <= 1) {
    let leng = disk.join('').substring(0, 2) + '/';
    let newA = disk.map(item => {
      return item = leng
    })
    return disk = newA
  }
  disk.pop();
  res.send({len: disk.length})
});

app.post('/path', function(req, res, next) {
  fs.stat(req.body.path, function(err) {
    if (!err) {
      let newArr = [];
      newArr.push(req.body.path)
      disk = newArr
    }
  });
});

app.listen(process.env.PORT || 8081)