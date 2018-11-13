export function parseInput(data){
  if(!data || data.trim().length === 0) return null;
  let toReturn = [];
  const regexLibraray = /Iteration: \s*\d+\s--\sFitness:\s*\d+\s--\sValid:\s*(true|false)\s--\sPath:\s\[(\d+|,\s)*\]/gm;
  const lines = data.match(regexLibraray);
  if(lines){
    for(let line of lines ){
      const obj = parseLine(line);
      let result = `${obj.iteration} Iterationen - Fitness: ${obj.fitness}`;
      toReturn.push({
        item: obj,
        data: result,
        isLibData: true
      });
    }
  }else{
    toReturn.push({
      item: data,
      data: null,
      isLibData: false
    });
  }
  
  return toReturn;
}

export function isLibraryOutput(data){
  const regexLibraray = /Iteration: \s*\d+\s--\sFitness:\s*\d+\s--\sValid:\s*(true|false)\s--\sPath:\s\[(\d+|,\s)*\]/gm;
  return data.match(regexLibraray);
}

function parseLine(line){
  let obj = {};
  const keyValuePairs = line.split("--").map((s) => s.split(':'));
  keyValuePairs.forEach((pair) => {
    obj[pair[0].trim().toLowerCase()] = pair[1].trim();
  });
  return obj;
}