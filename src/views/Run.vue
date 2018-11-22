<template>
  <v-container fluid fill-height ref="wrapper" style="max-height: 100%">
  
    <consol-dialog :item="selected" @close="selected = null"></consol-dialog>
    <v-layout row justify-space-around style="flex-wrap: wrap-reverse" v-resize="onResize">
      <v-flex xs12 md7>
        <v-layout row justify-space-around wrap>
          <v-flex xs5>
            <v-card >
              <v-toolbar>
                <v-subheader style="padding-left: 0">
                   Prozesse Warteschlange
                </v-subheader>
                <v-spacer></v-spacer>
                <v-btn color="red" :disabled="!isRunning" @click="stopExecution">Stop</v-btn>   
              </v-toolbar> 
              <v-layout v-if="getProcesses" style="padding: 10px;">
                <h5>Laufende: {{ processQueueFilter((p) => p.status === 'running').length }}</h5>
                <v-spacer></v-spacer>
                <h5>Wartende: {{  processQueueFilter((p) => p.status === 'waiting').length }}</h5>
              </v-layout>

              <v-list class="list" two-line v-show="Object.keys(processQueue).length > 0" :style="{maxHeight: maxHeight + 'px'}">
                <v-list-tile
                  v-for="item in processQueue"
                  :key="item.id">  
                  <v-list-tile-action>
                    <v-icon v-if="item.status === 'running'" color="green">play_arrow</v-icon>
                    <v-icon v-else color="orange">play_arrow</v-icon>
                  </v-list-tile-action>

                  <v-list-tile-content>
                    <v-list-tile-title>
                      <v-layout>
                        <h4>{{ item.name }}</h4>
                        <v-spacer></v-spacer>
                        <h5>{{ item.dataset }}</h5>
                      </v-layout>
                    </v-list-tile-title>
                    <v-list-tile-sub-title v-html="item.libOutput"></v-list-tile-sub-title>
                  </v-list-tile-content>
                </v-list-tile>
              </v-list>
            </v-card>
          </v-flex>

          <v-flex xs5>
            <v-card>
              <v-toolbar>
                <v-subheader style="padding-left: 0">
                  History
                </v-subheader>
                <v-spacer></v-spacer>
                <v-btn icon @click="clearProcesses">
                  <v-icon color="red" >delete</v-icon>
                </v-btn>    
              </v-toolbar> 
              <v-layout v-if="getProcesses" style="padding: 10px;">
                <h5>Erfolgreich: {{ processFilter((p) => p.status === 'finished').length }}</h5>
                <v-spacer></v-spacer>
                <h5>Fehlgeschlagen: {{  processFilter((p) => p.status === 'error').length }}</h5>
              </v-layout>
              <ul class="list" :style="{maxHeight: maxHeight + 'px'}">
                <template v-for="item in getProcesses">
                  <li v-for="(r,i) in item.runs" 
                      :key="item.name + '/' + i" 
                      class="finished_items" 
                      @click="selected = r"
                      :style="{background: r.status === 'finished' ? 'lightgreen' : 'lightcoral'}">
                        <v-layout>
                          <h4>{{ i + 1 }}. {{ r.name }}</h4>
                          <v-spacer></v-spacer>
                          <h5>{{ r.dataset }}</h5>
                        </v-layout>
                      
                        <p style="margin: 0; font-size: 12px">{{ r.status === 'error' ? 'Failed' : r.libOutput }}</p>
                  </li>
                </template>
              </ul>
            </v-card>
          </v-flex>
       
        </v-layout>
    
 
      </v-flex>
      <v-flex xs12 md4 style="border-left: 1px solid gray; padding-left: 20px;"> 
        <v-card>
          <v-toolbar>
            <v-subheader style="padding-left: 0">
              Einstellungen
            </v-subheader>
          </v-toolbar>

          <v-container>
            <v-combobox
              @click="fetchAlgorithms"
              v-model="selectAlgorithms"
              :items="getAlgorithms"
              label="Wähle Algorithmen: "
              multiple
              chips
              deletable-chips
            ></v-combobox>

            <v-combobox
              @click="fetchDatasets"
              v-model="selectDataset"
              :items="getDatasets"
              label="Wähle Datensatz: "  
            ></v-combobox>

            <v-layout justify-space-between row>
              <v-flex xs5>
                <v-text-field 
                  label="Anzahl an Durchläufen: "
                  type="number"
                  v-model.number="timesOfExecutions"
                ></v-text-field>
              </v-flex>
              <v-flex xs5>
                <v-text-field 
                  class="xs5"
                  label="Maximal Parallelität"
                  type="number"
                  v-model.number="numberOfThreads">
                </v-text-field>
              </v-flex>        
            </v-layout>
          </v-container>


       
          <v-card-actions style="padding-right: 25px; padding-left: 20px; padding-bottom: 15px;">
            
            <v-spacer></v-spacer>
            <v-btn color="primary" :disabled="!isRunPossible || isRunning" @click="exec">
              <v-icon>play_arrow</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>

  </v-container>
</template>

<script>
import ConsolDialog from '../components/ConsolDialog';
import resize from 'vue-resize-directive'
import { mapGetters, mapActions, mapMutations } from 'vuex';
export default {
  data(){
    return {
      activeTab: null, 
      selected: null,
      maxHeight: 0
    }
  },
  methods: {
    ...mapActions(['fetchAlgorithms', 'fetchDatasets', 'exec']),
    ...mapMutations(['setSelectedDataset', 'setSelectedAlgorithms', 'setTimesOfExecution', 'setNumberOfThreads', 'clearProcessQueue', 'clearProcesses']),
    generateOutput(outputs){
      return outputs.join("\n");
    },
    stopExecution(){
      this.clearProcessQueue();
    },
    processFilter(filter){
      if(Object.keys(this.getProcesses).length === 0) return [];
      return Object.keys(this.getProcesses).reduce((acc, key) => {
        const filtered = this.getProcesses[key].runs.filter(filter);
        if(filtered) acc = [...acc, ...filtered];
        return acc;
      }, [])
    },
    processQueueFilter(filter){
      if(Object.keys(this.processQueue).length === 0) return [];
      return Object.keys(this.processQueue).reduce((acc, key) => {
          if(filter(this.processQueue[key])){
            acc = [...acc, this.processQueue];
          }
          return acc;
      }, [])
    },
    onResize(wrapper){
      this.maxHeight = wrapper.offsetHeight - 48 - 2*28;
    }
  },
  computed: {
    ...mapGetters(['getProcesses','isSetuped', 'getAlgorithms', 'processQueue', 'runningProcesses', 'threads',
                'getDatasets', 'getSelectedDataset', 
                'getSelectedAlgorithms', 'getTimesOfExecution', 'isRunPossible']),
    isRunning(){
      return this.processQueue && Object.keys(this.processQueue).length > 0;
    },
    selectAlgorithms:{
      get(){
        return this.getSelectedAlgorithms;
      },
      set(value){
        this.setSelectedAlgorithms(value);
      }
    },
    selectDataset:{
      get(){
        return this.getSelectedDataset;
      },
      set(value){
        this.setSelectedDataset(value);
      }
    },
    timesOfExecutions:{
      get(){
        return this.getTimesOfExecution;
      },
      set(value){
        this.setTimesOfExecution(value);
      }
    },
    numberOfThreads: {
      get(){
        return this.threads;
      },
      set(value){
        this.setNumberOfThreads(value);
      }
    }
  },
  components: {
    ConsolDialog
  },
  mounted(){
    this.onResize(this.$refs.wrapper)
  },
  directives: {
      resize,
  }
}
</script>

<style>
  .finished_items{
    list-style: none;
    padding: 10px;
    border-bottom: 1px solid rgb(177, 177, 177);
    cursor: pointer;
  }

  .finished_items:hover{
    background: rgba(255,255,255, 0.5);
  }

  .list {
    list-style: none;
    padding: 0; 
    margin: 0; 
    overflow-y: scroll
  }
</style>
