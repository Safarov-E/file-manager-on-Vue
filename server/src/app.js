const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const fs = require('fs');
const childProcess = require('child_process');
const fse = require('fs-extra')

const app = express()
app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(cors())

function getLocalDiskNames() {
  const buffer = childProcess.execSync('wmic logicaldisk get Caption  /format:list').toString();
  const lines = buffer.split('\r\r\n');

  const disks = [];

  for (const line of lines) {
    if (!line) {
      continue;
    }

    const lineData = line.split('=');
    disks.push(lineData[1]);
  }

  return disks;
}

let disk = []
disk.push(getLocalDiskNames()[0] + '/');

app.post('/folder', function (req, res, next) {
  if (req.body.path) {
    let newPath = []
    newPath.push(req.body.path)
    disk = newPath
  }

  let arr = []
  fs.readdir(disk.join(''), function (err, items) {
    if (err) {
      return res.status(404).send('Невозможно прочесть содержимое файла или директории')
    } else if (items.length == 0) {
      res.send(arr)
    }
    items.forEach((file, index, allFiles) => {
      var files = disk.join('') + '/' + file;
      fs.stat(files, (err, stats) => {
        if (err) {
          return;
        }
        arr.push({
          file,
          size: stats["size"],
          birthtime: stats['mtime']
        })
        if (index === allFiles.length - 1) {
          res.send(arr)
        }
      });
    })
  });
});

app.post('/path', function (req, res, next) {
  var str = req.body.path;
  str = str.replace(/\\/g, '/');
  fs.stat(str, function (err) {
    if (!err) {
      let newArr = [];
      newArr.push(str)
      disk = newArr
      res.send(disk)
    } else {
      return res.send(disk)
    }
  });
});

app.get('/disk-selection', function (req, res, next) {
  res.send(getLocalDiskNames())
});

app.post('/new-disk', function (req, res, next) {
  let newArr = [];
  newArr.push(req.body.path + '/')
  disk = newArr
  res.send(disk)
});

app.get('/current-directory', function (req, res, next) {
  res.send(disk)
});

app.post('/create-folder', function (req, res, next) {
  fs.mkdir(req.body.folderName, err => {
    res.send({
      result: 1
    });
  })
});

app.post('/create-file', function (req, res, next) {
  fs.writeFile(req.body.file_name, '', (err) => {
    if (err) {
      res.send({
        result: 0
      });
    } else {
      res.send({
        result: 1
      });
    }
  });
});

app.post('/delete-content', function (req, res, next) {
  fse.remove(req.body.fileName, err => {
    if (err) {
      res.send({
        result: 0
      });
    } else {
      res.send({
        result: 1
      });
    }
  })
});

app.post('/move-content', function (req, res, next) {
  try {
    fse.copySync(req.body.oldfile, req.body.newFile);
    res.send({
      result: 1
    });
  } catch (err) {
    res.send({
      result: 0
    });
    console.error(err);
  }
});

app.post('/rename', function (req, res, next) {
  fs.rename(req.body.oldName, req.body.newName, (err) => {
    if (err) {
      res.send({
        result: 0
      });
    } else {
      res.send({
        result: 1
      });
    }
  });
});

app.listen(process.env.PORT || 3000);