<template>
  <v-container fill-height>
    <v-dialog
      width="50%"
      v-model="dataDialog">
      <v-card style="background: rgba(255,255,255,0.6); color: black; padding-bottom: 15px;" >
        <v-toolbar style="background: rgba(255,255,255,0.8);">
          Auswahl der Algorithmen und Datensätzen
        </v-toolbar>

        <v-alert style="margin: 15px; margin-bottom: 0" type="info" v-if="getAlgorithms.length === 0" value="true">Es sind keine Ergebnisse vorhanden. Bitte prüfe deinen Ordner oder führe Durchläufe aus!</v-alert>
        <v-layout row justify-space-around pa-4 v-else>
          <v-flex xs5>
            <fieldset style="text-align:center; padding: 0; margin: 0;">
              <legend>Algorithmen</legend>
              <v-layout row wrap> 
                <v-flex
                  xs5
                  class="list-elements"
                  style=""
                  v-for="algorithm of getAlgorithms"
                  :key="algorithm"
                  @click="checkAlgorithm(algorithm)">

                  <v-layout>
                    <v-subheader>{{ algorithm }}</v-subheader>
                    <v-spacer></v-spacer>
                    <v-icon v-if="selectedAlgorithm.includes(algorithm)" color="green">check</v-icon>
                  </v-layout>
                </v-flex>
              </v-layout>
            </fieldset>
            
          </v-flex>
          <v-flex xs5>
            <fieldset style="text-align:center; padding: 0; margin: 0;">
              <legend>Datensätze</legend>
              <v-layout row wrap>
                <v-flex
                  xs5
                  class="list-elements"
                  style=""
                  v-for="dataset of getDatasets"
                  :key="dataset"
                  @click="checkDataset(dataset)">

                  <v-layout>
                    <v-subheader>{{ dataset }}</v-subheader>
                    <v-spacer></v-spacer>
                    <v-icon v-if="selectedDataset.includes(dataset)" color="green">check</v-icon>
                  </v-layout>
         
                </v-flex>
              </v-layout>
            </fieldset>
          </v-flex>
        </v-layout>
        
      
        <v-card-actions v-show="!minimize" style="background: rgba(255,255,255,0.6); color: white;"  v-if="getAlgorithms.length > 0" >       
          <v-btn @click="reset">Lösche Einstellungen</v-btn>
          <v-spacer></v-spacer>
          <v-btn 
            @click="load" 
            :disabled="!loadIsPossible"
          >Lade</v-btn>
        </v-card-actions>
      </v-card>        
    </v-dialog>
 
    <v-layout style="margin-bottom: 24px;">
      <v-flex xs12>
        <v-card>

          <v-toolbar>
            <v-btn @click="dataDialog = true;" color="green">Datensätze</v-btn>
            <v-subheader>Visualisierung</v-subheader>
            <v-spacer></v-spacer>
            <v-btn 
              @click="calculateStandardDevision"
              :color="activ.standardDeviation ? 'green' : 'red'">
              Standardabweichung
            </v-btn>
            <v-btn @click="minMax" :color="activ.minMax ? 'green' : 'red'">minMax</v-btn>
            <v-btn @click="reload">Neu laden</v-btn>
          </v-toolbar>
          
          <canvas id="canvas"></canvas>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
  
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import Chart from 'chart.js'
import { joinIterations, avgIterations, standardDeviation, transformIterationToDatasetData } from '../util/chartjs.js';
export default {
  data(){
    return {
      dataDialog: true,
      stepSize: 20,
      minimize: false,
      colors: {
        "red": "red",
        "blue": "blue",
        "pink": "pink",
        "yellow": "yellow",
        "green": "green",
        
      },
      activ: {
        standardDeviation: false,
        minMax: false
      },
      selectedAlgorithm: [],
      selectedDataset: [],
      shown: {},
      xLabels: [],
      config: {
        type: 'line',
        yAxisID: "0",
        data: {
          labels: [0, 20, 40, 60, 80]
        },
        options: {
          animationDuration: 0,
          responsive: true,
          title: {
            display: true,
            text: 'Chart.js Line Chart'
          },
          tooltips: {
            position: 'nearest',
            intersect: true,
            mode: 'index',
            axis: 'x'
          },
          hover: {
            mode: 'nearest',
            intersect: true
          },
          scales: {
            xAxes: [{
              display: true,
              scaleLabel: {
                display: true,
                labelString: 'Iterations'
              }
            }],
            yAxes: [{
              display: true,
              scaleLabel: {
                display: true,
                labelString: 'Fitness'
              }
            }]
          }
        }
      }
    }
  },
  computed: {
    ...mapGetters(['getSavedData', 'getLoadedData']),
    loadedData(){
      return this.getLoadedData;
    },
    getAlgorithms(){
      if(!this.getSavedData) return [];
      return Object.keys(this.getSavedData).reduce((acc, crr) => {
        for(let selectData of this.selectedDataset){
          if(!this.getSavedData[crr].includes(selectData)) return acc;
        }
        acc.push(crr);
        return acc;
      }, []);
    },
    getDatasets(){
      if(!this.getSavedData) return [];
      return Object.keys(this.getSavedData).reduce((acc, crr) => {
        return [...acc, ...this.getSavedData[crr]];
      }, []).reduce((acc, crr) => {
        let bothHaveData = true;
        for(let selectAlg of this.selectedAlgorithm){
          if(bothHaveData) bothHaveData = this.getSavedData[selectAlg].includes(crr);
        }
        if(!bothHaveData) return acc;
        if(!acc.includes(crr)) acc.push(crr);
        return acc;
      }, []);

    },
    loadIsPossible(){
      return this.selectedAlgorithm.length > 0 && this.selectedDataset.length > 0;
    },
    selectedItemAsPath(){
      const toReturn = [];
      for(let alg of this.selectedAlgorithm){
        for(let data of this.selectedDataset){
          toReturn.push(alg + "/" + data);
        }
      }
      return toReturn;
    }
  },
  watch: {
    getLoadedData(oldState, newState){
      const newItems = Object.keys(this.getLoadedData).filter((key) => {
        return this.selectedItemAsPath.includes(key) 
                && this.config.data.datasets.findIndex((dataset) => dataset.label === key) < 0;
      });

      for(let newItem of newItems){
        this.addDataset(this.getLoadedData[newItem]);
      }
    }
  },
  methods: {
    ...mapActions(['fetchSavedData', 'loadSavedData']),
    checkAlgorithm(item){
      const index = this.selectedAlgorithm.indexOf(item);
      if(index >= 0){
        this.selectedAlgorithm.splice(index, 1);
      }else{
        this.selectedAlgorithm.push(item);
      }
    },
    checkDataset(item){
      const index = this.selectedDataset.indexOf(item);
      if(index >= 0){
        this.selectedDataset.splice(index, 1);
      }else{
        this.selectedDataset.push(item);
      }
    },
    reload(){
       this.loadSavedData({
        algorithms: this.selectedAlgorithm, 
        datasets: this.selectedDataset,
        force: true
      });
    },
    load(){
      this.dataDialog = false;
      this.removeEverthing();
      this.loadSavedData({
        algorithms: this.selectedAlgorithm, 
        datasets: this.selectedDataset
      });
    },
    reset(){
      this.selectedAlgorithm = [];
      this.selectedDataset = [];
      this.config.data.datasets = [];
      window.myLine.update();
    },
    addDatasetToView(dataset){
      const colorNames = Object.keys(this.colors);
      const colorName = colorNames[ this.config.data.datasets.length % colorNames.length];
      const newDataset = {
        backgroundColor: this.colors[colorName],
        borderColor:  this.colors[colorName],
        fill: false,
        ...dataset
      };
      this.config.data.datasets.push(newDataset);
      window.myLine.update();
    },
    updateXAxies(iterations,stepSize){ 
      this.config.data.labels = [];
      for(let i = 0; i < iterations.length/stepSize; i++){ 
        if(!this.config.data.labels.includes(i * stepSize)){
          this.config.data.labels.push(i * stepSize);
        }
      }
    },

    resetXAxies(times, stepSize){
      this.config.data.labels = []; 
      for(let i = 0; i < times; i++)
        this.config.data.labels.push(i * stepSize);
    },
    addDataset(item){  
      let steps = item.runs[0].iterations.length;
      if(steps < 20){ 
        steps = 1;  
      }
      const minMax = this.checkMinMaxXAxies();
      if(minMax.num < 20) minMax.num = 1;
      this.stepSize = Math.min(Math.min(minMax.num, 20), steps);
      const dataset = minMax.dataset.length > item.runs[0].iterations.length ? minMax.dataset : item.runs[0].iterations;
    
      let joinedIterations = joinIterations(item, this.stepSize);
      let avgData = avgIterations(joinedIterations);
      this.updateXAxies(dataset, this.stepSize);
      this.addDatasetToView({
        label: item.algorithm +"/"+ item.dataset,
        data: avgData,
      });
    
    },
    calculateStandardDevision(){
      if(this.activ.standardDeviation){
        this.activ.standardDeviation = false;
        for(let dataset of this.config.data.datasets){
          const matching = dataset.label.match(/Lower|Upper/);
          if(matching){
            this.removeDataset(dataset.label);
          }
        }
        return;
      }
      for(let dataset of this.config.data.datasets){
        this.activ.standardDeviation = true;
        const item = this.loadedData[dataset.label];
        if(item){
          let joinedIterations = joinIterations(item, this.stepSize);
          let avgData = dataset.data;
          let s = standardDeviation(joinedIterations, avgData, this.stepSize);
       
          for(let i = 0; i <= 2; i+= 2){
            this.addDatasetToView({
              label: (i - 1) < 0 ? "Lower: " + dataset.label : "Upper: " + dataset.label, 
              data: s.map((d, index) => avgData[index] + (d * (i - 1))),
              borderColor: dataset.borderColor,
              borderDash: [5, 5],
              pointRadius: 0
            });
          }
        }   
      }  
    },
    minMax(){
      if(this.activ.minMax){
        /*
        this.activ.minMax = false;
        for(let dataset of this.config.data.datasets){
          const matching = dataset.label.match(/Min|Max/);
          if(matching){
            this.removeDataset(dataset.label);
            const label = dataset.label.replace("Max: ", "");
            if(this.loadedData[label]) this.addDataset(this.loadedData[label]);
          }
        } 
        */
        this.activ.minMax = false;

         this.config.data.datasets = [];
         this.load();
        return;
      }
      for(let dataset of this.config.data.datasets){
        const item = this.loadedData[dataset.label];
        this.activ.minMax = true;
        if(item){
          const minMaxResult = item.runs.reduce((acc, crr) => {
            const best = crr.iterations[crr.iterations.length - 1];
            if(!acc.max) acc.max = crr.iterations;
            if(!acc.min) acc.min = crr.iterations;
            if(acc.max[acc.max.length - 1].fitness < best.fitness) acc.max = crr.iterations;
            if(acc.min[acc.min.length - 1].fitness > best.fitness) acc.min = crr.iterations;
            return acc;    
          }, {
            min: null,
            max: null
          });
          const min = transformIterationToDatasetData(minMaxResult.min, this.stepSize);
          const max = transformIterationToDatasetData(minMaxResult.max, this.stepSize);
          this.addDatasetToView({
            borderColor: dataset.borderColor,
            backgroundColor: 'blue',
            label:  "Min: " + dataset.label,
            data: min,
          });
          this.addDatasetToView({
            borderColor: dataset.borderColor,
            backgroundColor: 'red',
            label:  "Max: " + dataset.label,
            data: max,
          });
          //this.removeDataset(dataset.label);
        }
      }
    },
    setup(){
      var ctx = document.getElementById('canvas').getContext('2d');
      window.myLine = new Chart(ctx, this.config);
    },
    removeEverthing(){
      this.config.data.datasets = [];
      window.myLine.update();


/*
      this.config.data.datasets = this.config.data.datasets.filter((dataset) => {
        return this.selectedItemAsPath.includes(dataset.label)
      });
      const minMax = this.checkMinMaxXAxies();
      if(minMax.dataset.length > 0 && minMax.num != Number.MAX_SAFE_INTEGER){
        if(minMax.num < 20){
          minMax.num = 1;  
        }
        this.stepSize = Math.min(minMax.num, 20);
        this.updateXAxies(minMax.dataset, this.stepSize);
      }
*/
     // window.myLine.update();
    },
    removeDataset(label){
      this.config.data.datasets = this.config.data.datasets.filter((dataset) => {
        return dataset.label !== label;
      });

      window.myLine.update();
    },
    checkMinMaxXAxies(){
      return this.config.data.datasets.reduce((acc, crr) => {
        if(acc.num > crr.data.length) {
          acc.num = crr.data.length;
        }
        if(acc.dataset.length <= crr.data.length){
          acc.dataset = crr.data;
        }
        return acc;
      }, {dataset: [], num: Number.MAX_SAFE_INTEGER});     
    }
  },
  mounted(){
    this.fetchSavedData();
		this.setup();
  }
}
</script>

<style>
  .control-panel{
    position: absolute; 
    top: 15px; 
    right: 15px; 
 
    height: 50px; 
    background: gray;
  }


  .list-elements{
    width: 100%; 
    background: rgba(255,255,255, 0.8);
    border-bottom: 1px solid gray;
    margin: 5px;
    cursor: pointer;
  }

  .list-elements:hover{
    background: rgba(0,0,0,0.3);
  }
</style>
