//import electron from 'electron';
//const fs = electron.remote.require('fs');

const fs = require('fs');
const cache = {};

async function read(path){
  console.log("read")
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
        algorithm: splittedPath[splittedPath.length - 1],
        dataset: splittedPath[splittedPath.length - 2],
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


module.exports = {
  read, write
}