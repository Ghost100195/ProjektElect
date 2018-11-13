import Vue from 'vue'
import Vuex from 'vuex'
import electron from 'electron';
import { parseInput } from './util/process';
import { write } from './util/output';
const isDevelopment = process.env.NODE_ENV !== 'production'


Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    directoryJars: isDevelopment ? "C:/Users/Lennard/Desktop/Playground/RuntimeEnviremont/algorithms" : "",
    directoryDatasets: isDevelopment ? "C:/Users/Lennard/Desktop/Playground/RuntimeEnviremont/datasets" : "",
    directorySaves: isDevelopment ? "C:/Users/Lennard/Desktop/Playground/RuntimeEnviremont/results" : "",
    algorithms: null,
    datasets: null,
    selectedDataset: null,
    selectedAlgorithms: null,
    timesOfExecutions: 1,
    processes: {},
    processQueue: {},
    runningProcesses: 0,
    threads: 2
  },
  mutations: {
    setDirectoryJars(state, path){
      state.directoryJars = path;
    },
    setDirectoryDatasets(state, path){
      state.directoryDatasets = path;
    },
    setDirectorySaves(state, path){
      state.directorySaves = path;
    },
    setAlgorithms(state, payload){
      state.algorithms = payload;
    },
    setDatasets(state, payload){
      state.datasets = payload;
    },
    setSelectedAlgorithms(state, payload){
      state.selectedAlgorithms = payload;
    },
    setSelectedDataset(state, payload){
      state.selectedDataset = payload;
    },
    setTimesOfExecution(state, payload){
      state.timesOfExecutions = payload;
    },
    addNewProcess(state, payload){
      state.processQueue[payload.id] = {...payload};
    },
    setRunning(state, payload){
      state.processQueue[payload.id] = {
        ...state.processQueue[payload.id], 
        status: 'running'
      };
      state.runningProcesses += 1;
    },
    addOutput(state, payload){
      state.processQueue[payload.id] = {
        ...state.processQueue[payload.id], 
        libOutput: payload.libOutput ? payload.libOutput : state.processQueue[payload.id].libOutput,
        raw: payload.raw ? [... state.processQueue[payload.id].raw,... payload.raw] : state.processQueue[payload.id].raw,
        best: payload.best ? payload.best: state.processQueue[payload.id].best
      };
    },
    addMutipleOutputs(state, payload){
      const raw = payload.filter((item) => item.raw).map((item) => item.raw);
      const lib = payload.filter((item) => item.libOutput)
                          .reduce((acc, crr, i) => {
                              return i > acc.index ? { libOutput: crr.libOutput, index: i} : acc;
                            },{
                              index: -1, 
                              libOutput: ""
                            });
      const best = payload.filter((item) => item.libOutput)
                          .reduce((acc, crr, i) => {
                              return i > acc.index ? { best: crr.best, index: i} : acc;
                            },{
                              index: -1, 
                              best: null
                            });
         
      state.processQueue[payload[0].id] = {
        ...state.processQueue[payload[0].id], 
        libOutput: lib.libOutput ? lib.libOutput : state.processQueue[payload[0].id].libOutput,
        raw: raw ? [...state.processQueue[payload[0].id].raw, ...raw] : state.processQueue[payload[0].id].raw,
        best: best.best ? best.best : state.processQueue[payload[0].id].best
      };
    },
    finish(state, payload){
      if(!state.processes[payload.name]) {
        state.processes[payload.name] = {
          name: payload.name,
          runs: []
        };
      }
      state.processes[payload.name].runs.push({ 
        ...state.processQueue[payload.id],
        status: payload.code === 0 ? 'finished' : 'error', 
      });
 
      Vue.delete(state.processQueue, payload.id);
      state.runningProcesses -= 1;
    },
    setNumberOfThreads(state, payload){
      state.threads = payload;
    }
  },
  actions: {
    fetchAlgorithms({ commit, getters }){
      const directoryJars = getters.getDirectoryJarsPath;
      if(directoryJars !== ""){   
        const electronFs = electron.remote.require('fs');
        electronFs.readdir(directoryJars, (err, data) => {
          if(data){
            const jars = data.filter((val) =>  val.indexOf('.jar') >= 0 && val.toLowerCase() !== "fitness.jar");
            commit('setAlgorithms',jars);
          }
        });
      }
    },
    fetchDatasets({ commit, getters }){
      const directoryDatasetsPath = getters.getDirectoryDatasetsPath;
      if(directoryDatasetsPath !== ""){   
        const electronFs = electron.remote.require('fs');
        electronFs.readdir(directoryDatasetsPath, (err, data) => {
          if(data){
            commit('setDatasets', data);
          }
        });
      }
    },
    exec({ getters, commit, dispatch }){    
      for(let alg of getters.getSelectedAlgorithms){
        const runs = new Array(Number.parseInt(getters.getTimesOfExecution))
                              .fill({ 
                                status: 'waiting', 
                                libOutput: '', 
                                best: null,
                                raw: [], 
                                jar: alg,
                                name: alg.replace(".jar", "")
                              }).map((r, i) => ({...r, id: alg+i }));
        for(let r of runs){
          commit('addNewProcess', r);
        }
      }   
      
      dispatch('startProcess');
    },
    startProcess({ getters, commit, dispatch }){
      for(let key in getters.processQueue){
        if(getters.runningProcesses < getters.threads && getters.processQueue[key].status === 'waiting'){  
          const item = getters.processQueue[key];
          commit('setRunning', item);
          const spawn =  electron.remote.require('child_process').spawn;
          const java = 'java';
          const jar = '-jar';
    
          const pathJar = `${getters.getDirectoryJarsPath}/${item.jar}`;
          const pathToData = `${getters.getDirectoryDatasetsPath}/${getters.getSelectedDataset}`;
          const child = spawn(java, [ jar, pathJar, pathToData ] );
    
          let iterations = [];
          let cache = [];
          
          child.stdout.on('data', (data) => {
            const convertedData = data.toString();
            const results = parseInput(convertedData);
            if(results){
              for(let result of results){
                if(result.isLibData){
                  iterations.push(result.item);
                }
                cache.push({
                    id: item.id,
                    best: result.isLibData ? result.item : null,
                    libOutput: result.isLibData ? result.data : null,
                    raw: convertedData //!result.isLibData ? result.data : null,
                  }
                );
              }
            }
            
            if(cache.length > 25) {
              commit('addMutipleOutputs', cache);
              cache = [];
            }
          });
    
          child.stderr.on('data', (data) => {
            commit('addOutput', {
              id: item.id,
              raw: [ data.toString() ],
              libOutput: null
            });
            console.log(`stderr: ${data}`);
          });
          
          child.on('close', (code) => {
            if(cache.length > 0) commit('addMutipleOutputs', cache);

            write(`${getters.getDirectorySavesPath}/${item.jar}/${getters.getSelectedDataset}`, [{ iterations }], {cacheCount: getters.getOpenProcessForAlgorithm(item.name) - 1});
            commit('finish', {
              id: item.id,
              name: item.name,
              code
            }); 
            dispatch('startProcess');
            console.log(`child process exited with code ${code}`);
          });
        }                      
      }
    }
  },
  getters: {
    getDirectoryDatasetsPath(state){
      return state.directoryDatasets;
    },
    getDirectoryJarsPath(state){
      return state.directoryJars;
    },
    getDirectorySavesPath(state){
      return state.directorySaves;
    },
    isSetuped(state){
      return state.directoryJars !== "" && state.directoryDatasets !== "" && state.directorySaves !== "";
    },
    getAlgorithms(state){
      return state.algorithms ? state.algorithms : [];
    },
    getDatasets(state){
      return state.datasets ? state.datasets : [];
    }, 
    getSelectedAlgorithms(state){
      return state.selectedAlgorithms ? state.selectedAlgorithms : [];
    }, 
    getSelectedDataset(state){
      return state.selectedDataset ? state.selectedDataset : [];
    },
    getTimesOfExecution(state){
      return state.timesOfExecutions;
    },
    isRunPossible(state){
      return state.timesOfExecutions > 0 && state.selectedAlgorithms && state.selectedAlgorithms.length > 0 && state.selectedDataset;
    },
    getProcesses(state){
      return state.processes;
    },
    processQueue(state){
      return state.processQueue;
    },
    runningProcesses(state){
      return state.runningProcesses;
    },
    threads(state){
      return state.threads;
    },
    getOpenProcessForAlgorithm(state){
      return (algorithmName) => {
        return Object.keys(state.processQueue).filter((key) => state.processQueue[key].name === algorithmName).length;
      }
    }
  }
})
