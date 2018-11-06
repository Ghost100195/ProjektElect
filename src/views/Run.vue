<template>
  <v-container fluid>
    <my-dialog v-if="!isSetuped || forceSetup" @finish="forceSetup = false"></my-dialog>

    <v-layout row justify-space-around nowrap>
      <v-flex xs7>
        <v-tabs
          v-if="getProcesses.length > 0"
          v-model="activeTab"
          color="cyan"
          dark
          slider-color="yellow">
          <v-tab
            v-for="terminal in getProcesses"
            :key="terminal.key"
            ripple>
            {{ terminal.name }}
          </v-tab>
          <v-tab-item
            v-for="(terminal, i) in getProcesses"
            :key="terminal.key + i">
            <v-card flat>
              <v-card-text>
                <v-textarea
                  style="max-height: 500px; overflow-y: scroll"
                  auto-grow
                  :value="generateOutput(terminal.output)"
                ></v-textarea>
              </v-card-text>
              
            </v-card>
          </v-tab-item>
        </v-tabs>
        <v-subheader v-else>
          Keine aktiven Prozesse!
        </v-subheader>
      </v-flex>
      <v-flex xs4> 
        <h2>
          <v-btn icon @click="test">
            <v-icon>settings</v-icon>
          </v-btn>Einstellungen  
        </h2>
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

        <v-btn color="primary" :disabled="!isRunPossible" @click="exec">Run</v-btn>
      </v-flex>
    </v-layout>

  </v-container>
</template>

<script>
import MyDialog from '../components/Dialog';
import { mapGetters, mapActions, mapMutations } from 'vuex';
export default {
  data(){
    return {
      forceSetup: false,
      activeTab: null
    }
  },
  methods: {
    ...mapActions(['fetchAlgorithms', 'fetchDatasets', 'exec']),
    ...mapMutations(['setSelectedDataset', 'setSelectedAlgorithms', 'setTimesOfExecution']),
    test(){   
      this.forceSetup = true 
    },
    generateOutput(outputs){
      return outputs.join("\n");
    }
  },
  components: {
    MyDialog
  },
  computed: {
    ...mapGetters(['getProcesses','isSetuped', 'getAlgorithms', 
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
    }
  }
}
</script>

<style>

</style>
