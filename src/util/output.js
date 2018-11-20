//import electron from 'electron';
//const fs = electron.remote.require('fs');

const fs = require('fs');
const cache = {};

async function read(path){
  return new Promise((resolve, reject) => {
    fs.readFile(path + ".json", (err, data) => {
      if(err && err.code === 'ENOENT') {
        reject(err);
      }else{
        resolve(JSON.parse(data));
      }
    });
  });
}

async function write(path, dataForFile, options){

  const { cacheCount } = options;
  return new Promise(async (resolve, reject) => {
    if(cache[path]){
      cache[path].runs = [...cache[path].runs, ...dataForFile];
    }else{
      const splittedPath = path.split("/");
      cache[path] = {
        algorithm: splittedPath[splittedPath.length - 2],
        dataset: splittedPath[splittedPath.length - 1],
        runs: [...dataForFile]
      } 
    }

    const writeIntoFile = async (insertData) => {
      fs.writeFile(path + ".json", JSON.stringify(insertData, null, 2), (err, data) => {
        if(err && err.code === 'ENOENT') {
          const directory = path.split("/");
          directory.pop();
          fs.mkdir(directory.join("/"), { recursive: true }, async (err) => {
            if(!err){
              return writeIntoFile(insertData);
            }
          });
        }else{
          return;  
        }
      });
    }

    if(cacheCount > 0){
      resolve();
      return;
    }else{
      try{
        const file = await read(path);
        cache[path].runs = [...file.runs, ...result.runs];
      }catch(err){}
   
      await writeIntoFile(cache[path]);
      delete cache[path]; 
      resolve();
    }

  })
}

async function readResultsFolder(path){
  return new Promise(async (resolve, reject) => {
    const toReturn = {};
    const jarFolders = await readDir(path);
    for(let jarFolder of jarFolders){
      let datasets = await readDir(path + "/" + jarFolder);
      datasets = datasets.map((d) => {
        return d.replace(".json", "");
      });
      toReturn[jarFolder] = [...datasets];
    }
    resolve(toReturn);
  });
}


async function readDir(path){
  return new Promise((resolve) => {
    fs.readdir(path, (err, files) => {
      resolve(files);
    });
  });
}

async function writeConfigFile(config){

  console.log(config);
  return new Promise((resolve) => {
    fs.writeFile('./config.json', JSON.stringify(config, null, 2), (err) => {
      if(err){
        console.log(err);
      }else{
        resolve();
      }
    })
  })
}

async function readConfigFile(){
  return new Promise((resolve) => {
    fs.readFile('./config.json', (err, data) => {
      if(err){
      }else{
        const parsed = JSON.parse(data.toString());
        resolve(parsed);
      }
      
    })
  })
}

module.exports = {
  read, write, readResultsFolder, writeConfigFile, readConfigFile
}