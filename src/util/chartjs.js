export function joinIterations(item, stepSize){
  return item.runs
    .reduce((acc, crr, index) => [...acc, ...crr.iterations], [])
    .reduce((acc, crr) => {
      if(crr.iteration % stepSize === 0){
        if(!acc[crr.iteration]){
          acc[crr.iteration] = [];
        }
        acc[crr.iteration].push(crr.fitness);
      }
      return acc;
    }, {});
}

export function avgIterations(items){
  return Object.keys(items).map((iteration) => {
    return items[iteration].reduce((acc, crr) => Number.parseInt(crr) + acc, 0)/items[iteration].length;
  }).map((i) => Math.round(i));
}

export function standardDeviation(items, avg, steps){
  return Object.keys(items).map((iteration) => {
    return items[iteration]
      .reduce((acc, crr) => {
        const result = crr - avg[Math.floor(iteration / steps)];
        return acc + result * result;
      }, 0)/items[iteration].length;
  }).map((val) => Math.sqrt(val));
}
 
export function transformIterationToDatasetData(iteration, stepSize){
  return iteration
    .filter((iter) => iter.iteration % stepSize === 0)
    .map((iter) => iter.fitness);
}