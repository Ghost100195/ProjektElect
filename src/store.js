import Vue from 'vue'
import Vuex from 'vuex'
import electron from 'electron';
import crypto from 'crypto';


Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    directoryJars: "",//"C:/Users/Lennard/Documents/Uni/TicketSystem/CompetitiveEnvironment",
    directoryDatasets: "", //"C:/Users/Lennard/Documents/Uni/TicketSystem/CompetitiveEnvironment",
    algorithms: null,
    datasets: null,
    selectedDataset: null,
    selectedAlgorithms: null,
    timesOfExecutions: 10,
    processes: [],
  },
  mutations: {
    setDirectoryJars(state, path){
      state.directoryJars = path;
    },
    setDirectoryDatasets(state, path){
      state.directoryDatasets = path;
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
      state.processes.push(payload);
    },
    addOutputToProcess(state, payload){
      const index = state.processes.findIndex((p) => p.key === payload.key);
      state.processes[index].output.push(payload.output);
    }
  },
  actions: {
    fetchAlgorithms({ commit, getters }){
      const directoryJars = getters.getDirectoryJarsPath;
      if(directoryJars !== ""){   
        const electronFs = electron.remote.require('fs');
        electronFs.readdir(directoryJars, (err, data) => {
          const jars = data.filter((val) =>  val.indexOf('.jar') >= 0 && val.toLowerCase() !== "fitness.jar");
          commit('setAlgorithms',jars);
        });
      }
    },
    fetchDatasets({ commit, getters }){
      const directoryDatasetsPath = getters.getDirectoryDatasetsPath;
      if(directoryDatasetsPath !== ""){   
        const electronFs = electron.remote.require('fs');
        electronFs.readdir(directoryDatasetsPath, (err, data) => {
          commit('setDatasets', data);
        });
      }
    },
    exec({ getters, commit }){
      const spawn =  electron.remote.require('child_process').spawn;
      const java = 'java';
      const jar = '-jar';
      
      for(let i = 0; i < getters.getTimesOfExecution; i++){

        const pathJar = `${getters.getDirectoryJarsPath}/${getters.getSelectedAlgorithms[0]}`;
        const pathToData = `${getters.getDirectoryDatasetsPath}/${getters.getSelectedDataset}`;
        const child = spawn(java, [ jar, pathJar, pathToData ] );
        
        crypto.randomBytes(48, function(err, buffer) {
          const key = buffer.toString('hex');
          const name = getters.getSelectedAlgorithms[0].replace('.jar', '');
          
          commit('addNewProcess', {
            key,
            name,
            output: [],
          });
          
  
          child.stdout.on('data', (data) => {
            const convertedData = data.toString();
            if(convertedData.trim().length > 0){ 
              const split = convertedData.split('--');
              let obj = {
                key,
                output: `Output von ${name}: ${convertedData}`
              };
              // Stream into json 
              if(split.length === 4){
                const keyValuePairs = split.map((s) => s.split(':'));
      
                keyValuePairs.forEach((pair) => {
                  obj[pair[0].trim().toLowerCase()] = pair[1].trim();
                });
              
                obj.output = `${obj.iteration}: Fitness: ${obj.fitness}`;
              }
              
              commit('addOutputToProcess', obj);
            }
          });
    
          child.stderr.on('data', (data) => {
            console.log(`stderr: ${data}`);
          });
          
          child.on('close', (code) => {
            console.log(`child process exited with code ${code}`);
          });
        });  
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
    isSetuped(state){
      return state.directoryJars !== "" && state.directoryDatasets !== "";
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
    }
  }
})
