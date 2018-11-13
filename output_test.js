const { read, write } = require('./src/util/output.js');

const resultPath = "C:/Users/Lennard/Desktop/Playground/RuntimeEnviremont/results";

test();

/*

*/

async function test(){
  

  let result; 
  try{
    result = await read(resultPath + "/Cuckoo.jar/a280.tsp");
    console.log(result.runs.length);
    for(var r of result.runs){
      console.log(r.iterations.length);

    }

    
  }catch(err){
    console.log(err);
  }

}