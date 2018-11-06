<template>
  <v-stepper v-model="e1">
    <v-stepper-header>
      <v-stepper-step :complete="e1 > 1" step="1">Algorithmen</v-stepper-step>

      <v-divider></v-divider>

      <v-stepper-step :complete="e1 > 2" step="2">Datensätzen</v-stepper-step>
    </v-stepper-header>

    <v-stepper-items>
      <v-stepper-content step="1">
        <v-card
          class="mb-5"
          color="grey lighten-1"
          height="200px"
        >

          <v-container>
            <v-subheader>
              Wähle den Ordner in dem sich die Algorithmen befinden
            </v-subheader>
            <v-text-field
              :value="getDirectoryJarsPath"
              @click="openFileDialog('algorithm')"
              outline
              append-icon="folder_open"
              clearable
              single-line
              class="cursor"
              >
            </v-text-field>
          </v-container>
        </v-card>
        <v-btn flat>Cancel</v-btn>
        <v-btn
          color="primary"
          @click="e1 = 2"
          :disabled="!getDirectoryJarsPath && getDirectoryJarsPath.length <= 0"
        >
          Continue
        </v-btn>
      </v-stepper-content>

      <v-stepper-content step="2">
        <v-card
          class="mb-5"
          color="grey lighten-1"
          height="200px"
        >
        
          <v-container>
            <v-subheader>
              Wähle den Ordner in dem sich die Datensätze befinden
            </v-subheader>
            <v-text-field
              :value="getDirectoryDatasetsPath"
              @click="openFileDialog('dataset')"
              outline
              append-icon="folder_open"
              clearable
              single-line
              class="cursor"
              >
            </v-text-field>
          </v-container>
        </v-card>

        <v-btn flat>Cancel</v-btn>
          <v-btn
          color="primary"
          @click="finish"
          :disabled="!getDirectoryDatasetsPath && getDirectoryDatasetsPath.length <= 0"
        >
          Fertig
        </v-btn>
      </v-stepper-content>
    </v-stepper-items>
  </v-stepper>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex';
export default {
  data () {
    return {
      e1: 0,
    }
  },
  computed: {
    ...mapGetters(['getDirectoryDatasetsPath', 'getDirectoryJarsPath']),
  },
  methods: {
    ...mapMutations(['setDirectoryJars', 'setDirectoryDatasets']),
    finish(){
      this.$emit('finish');
    },
    openDirectoryForDatasets(paths){
      if(paths){ 
        this.setDirectoryDatasets(paths[0]);
      }
    },
    openDirectoryForAlgorithms(paths){
      if(paths){  
        this.setDirectoryJars(paths[0]);
      }
    },
    openFileDialog(type){
      const options = {
        properties: ['openFile', 'openDirectory', 'showHiddenFiles', 'multiSelections'],
        defaultPath: type === 'algorithm' ? this.getDirectoryJarsPath : this.getDirectoryDatasetsPath,
      };
      options.defaultPath = options.defaultPath.length ? options.defaultPath : "C:/";
      this.$electron.remote.dialog.showOpenDialog(options,( paths ) => {
        if(type === 'algorithm'){
          this.openDirectoryForAlgorithms(paths);
        }else{
          this.openDirectoryForDatasets(paths)
        }
      });      
    }
  },
  created(){
   
  }
}
</script>

<style>
  .cursor * {
    cursor: pointer;
  }
</style>
