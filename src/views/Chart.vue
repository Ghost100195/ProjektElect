<template>
  <v-container fill-height>
    <v-layout column fill-height>
      <v-flex>
        <v-card>
          <v-toolbar>
            <v-subheader>
              Einstellungen
   
            </v-subheader>
            <v-spacer></v-spacer>
            <v-btn icon @click="minimize = !minimize">
              <v-icon v-if="!minimize">keyboard_arrow_up</v-icon>
              <v-icon v-else>keyboard_arrow_down</v-icon>
            </v-btn>
          </v-toolbar>

          <v-layout row wrap justify-space-around v-show="!minimize">
            <v-flex xs4>
              <v-subheader>
                Algorithmen
              </v-subheader>
              <v-checkbox 
                v-for="algorithm of getAlgorithms"
                :key="algorithm"
                v-model="selectedAlgorithm" 
                :label="algorithm" 
                :value="algorithm">
              </v-checkbox>
            </v-flex>
            <v-flex xs4>
              <v-subheader>
                Dataset
              </v-subheader>
              <v-checkbox 
                v-for="dataset of getDatasets"
                :key="dataset"
                v-model="selectedDataset" 
                :label="dataset" 
                :value="dataset">
              </v-checkbox>
            </v-flex>
          </v-layout>

          <v-card-actions v-show="!minimize">       
            <v-btn @click="reset">Lösche Einstellungen</v-btn>
            <v-spacer></v-spacer>
            <v-btn 
              @click="load" 
              :disabled="!loadIsPossible"
            >Lade</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
      <v-flex xs12 style="position: relative">
        <div style="position: absolute; top: 15px; right: 15px; width: 300px; height: 50px; background: gray;"></div>
        <canvas id="canvas"></canvas>
      </v-flex>
    </v-layout>
  </v-container>
  
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import Chart from 'chart.js'
import { callbackify } from 'util';
export default {
  data(){
    return {
      minimize: false,
      colors: {
        "red": "red",
        "blue": "blue",
        "pink": "pink",
        "yellow": "yellow",
        "green": "green",
        
      },
      selectedAlgorithm: [],
      selectedDataset: [],
      shown: {},
      xLabels: [],
      config: {
        type: 'line',
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
    load(){
      this.config.data.datasets = this.config.data.datasets.filter((dataset) => {
        return this.selectedItemAsPath.includes(dataset.label)
      });
      window.myLine.update();

      this.loadSavedData({
        algorithms: this.selectedAlgorithm, 
        datasets: this.selectedDataset
      });
    },
    reset(){
      this.selectedAlgorithm = [];
      this.selectedDataset = [];
    },
    addDataset(item){
      const stepSize = 20;
      const colorNames = Object.keys(this.colors);
      const colorName = colorNames[ this.config.data.datasets.length % colorNames.length];
      const newDataset = {
        label: item.algorithm +"/"+ item.dataset,
          backgroundColor: this.colors[colorName],
          borderColor:  this.colors[colorName],
          data: [
            ...item.runs[0].iterations
                    .filter((_, index) => index % stepSize === 0)
                    .map((iter) => Number.parseInt(iter.fitness))
          ],
        fill: false,
      };

      
      for(let i = 0; i < item.runs[0].iterations.length/stepSize; i++){
        if(!this.config.data.labels.includes(i * stepSize)){
          this.config.data.labels.push(i * stepSize);
        }
      }

      this.config.data.datasets.push(newDataset);
      window.myLine.update();
    },
    setup(){
      console.log(this.getSavedData);
      
      var ctx = document.getElementById('canvas').getContext('2d');
      window.myLine = new Chart(ctx, this.config);
    }
  },
  mounted(){
    this.fetchSavedData();
		this.setup();
  }
}
</script>

<style>

</style>
