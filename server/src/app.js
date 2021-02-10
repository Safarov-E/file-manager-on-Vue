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
    if(!line) {
      continue;
    }

    const lineData = line.split('=');
    disks.push(lineData[1]);
  }

  return disks;
}

let disk = []
disk.push(getLocalDiskNames()[0] + '/');

app.post('/folder', function(req, res, next) {
  if(req.body.path) {
    let newPath = '/' + req.body.path
    disk.push(newPath)
  }
        // Реализовать чтение файлов
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
        return res.status(404).send('Невозможно прочесть содержимое файла или директории')
      }
      else if(items.length == 0) {
        res.send(arr)
      }
      items.forEach((file, index, allFiles) => {
        var files = disk.join('') + '/' +  file;
        fs.stat(files, (err, stats) => {
          if(err) {
            return 
          }
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
    } else {
      return res.send('Неверно указн путь!')
    }
  });
});

app.get('/disk-selection', function(req, res, next) {
  res.send(getLocalDiskNames())
});

app.post('/new-disk', function(req, res, next) {
  let newArr = [];
  newArr.push(req.body.path + '/')
  disk = newArr
});

app.get('/current-directory', function(req, res, next) {
	res.send(disk)
});

app.post('/create-folder', function(req, res, next) {
	fs.mkdir(req.body.path, err => {
		res.send(err)
	})
});

app.post('/create-file', function(req, res, next) {
	fs.appendFile(req.body.path, '', (err) => {
		if (err) res.send(err);
		console.log('The "data to append" was appended to file!');
	});
});

app.post('/delete-button', function(req, res, next) {
  fse.remove(req.body.path, err => {
		console.error(err)
	})
});

app.post('/move-contentn', function(req, res, next) {
  try { 
    fse.copySync(req.body.oldfile, req.body.newFile); 
    res.send('success');
  } 
  catch (err) {  
    console.error(err);
  }
});

app.post('/new-rename', function(req, res, next) {
	fs.rename(req.body.oldName, req.body.newName, (err) => {
		if (err) console.log(err);
		console.log('renamed complete');
	});
});

app.listen(process.env.PORT || 8081)