<template>
  <v-container fluid>
    <my-dialog v-if="!isSetuped || forceSetup" @finish="forceSetup = false"></my-dialog>
    <consol-dialog :item="selected" @close="selected = null"></consol-dialog>
    <v-layout row justify-space-around style="flex-wrap: wrap-reverse">
      <v-flex xs12 md7>
        <v-layout row justify-space-around wrap>
          <v-flex xs5>
            <v-card >
              <v-toolbar>
                Offene Prozesse {{ runningProcesses }}
              </v-toolbar> 
              <v-list two-line>
                <v-list-tile
                  v-for="item in processQueue"
                  :key="item.id">  
                  <v-list-tile-action>
                    <v-icon v-if="item.status === 'running'" color="green">play_arrow</v-icon>
                    <v-icon v-else color="orange">play_arrow</v-icon>
                  </v-list-tile-action>

                  <v-list-tile-content>
                    <v-list-tile-title v-html="item.name"></v-list-tile-title>
                    <v-list-tile-sub-title v-html="item.libOutput"></v-list-tile-sub-title>
                  </v-list-tile-content>
                </v-list-tile>
              </v-list>
            </v-card>
          </v-flex>

          <v-flex xs5>
            <v-card>
              <v-toolbar>
                History 
              </v-toolbar> 

              <ul style="list-style: none; padding: 0; margin: 0;">
                <template v-for="item in getProcesses">
                  <li v-for="(r,i) in item.runs" 
                      :key="item.name + i" 
                      class="finished_items" 
                      @click="selected = r"
                      :style="{background: r.status === 'finished' ? 'lightgreen' : 'lightcoral'}">
                    {{ r.name }} - Lauf {{ i + 1 }} - {{ r.status === 'error' ? 'Failed' : r.libOutput }}
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
            <v-subheader>
              Einstellungen
            </v-subheader>
            <v-spacer></v-spacer>
            <v-btn icon @click="forceSetup = true">
              <v-icon>settings</v-icon>
            </v-btn>  
          </v-toolbar>

          <v-container>
            <v-combobox
              @click="fetchAlgorithms"
              v-model="selectAlgorithms"
              :items="getAlgorithms"
              label="Wähle Algorithmen: "
              multiple
              chips
            ></v-combobox>

            <v-combobox
              @click="fetchDatasets"
              v-model="selectDataset"
              :items="getDatasets"
              label="Wähle Datensatz: "  
            ></v-combobox>

            <v-text-field 
              label="Wiederholungen: "
              type="number"
              v-model="timesOfExecutions"
            ></v-text-field>


            <v-text-field 
              label="Anzahl der Threads"
              type="number"
              v-model="numberOfThreads"></v-text-field>
          </v-container>


       
          <v-card-actions>
            <v-btn color="primary" :disabled="!isRunPossible" @click="exec">Run</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>

  </v-container>
</template>

<script>
import ConsolDialog from '../components/ConsolDialog';
import MyDialog from '../components/Dialog';
import { mapGetters, mapActions, mapMutations } from 'vuex';
export default {
  data(){
    return {
      forceSetup: false,
      activeTab: null, 
      selected: null
    }
  },
  methods: {
    ...mapActions(['fetchAlgorithms', 'fetchDatasets', 'exec']),
    ...mapMutations(['setSelectedDataset', 'setSelectedAlgorithms', 'setTimesOfExecution', 'setNumberOfThreads']),
    generateOutput(outputs){
      return outputs.join("\n");
    }
  },
  computed: {
    ...mapGetters(['getProcesses','isSetuped', 'getAlgorithms', 'processQueue', 'runningProcesses', 'threads',
                'getDatasets', 'getSelectedDataset', 
                'getSelectedAlgorithms', 'getTimesOfExecution', 'isRunPossible']),
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
    MyDialog,ConsolDialog
  },
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
</style>
