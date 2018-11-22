<template>
  <v-stepper v-model="e1">
    <v-stepper-header>
      <v-stepper-step :complete="e1 > 1" step="1">Algorithmen</v-stepper-step>

      <v-divider></v-divider>

      <v-stepper-step :complete="e1 > 2" step="2">Datensätzen</v-stepper-step>
      <v-divider></v-divider>

      <v-stepper-step :complete="e1 > 3" step="3">Ergebnisse</v-stepper-step>
    </v-stepper-header>

    <v-stepper-items>
      <v-stepper-content step="1">
        <v-card
          class="mb-1"  
          height="200px"

        >
          <v-container>
            <v-subheader>
              Wähle den Ordner in dem sich die Algorithmen (jars) befinden
            </v-subheader>
            <v-text-field
              :value="short(getDirectoryJarsPath)"
              @input="(val) => setPath(val, 'algorithm')"
              @click:append="openFileDialog('algorithm')"
              outline
              clearable
              append-icon="folder_open"
              single-line
              >
            </v-text-field>
          </v-container>
        </v-card>

        <v-layout>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            @click="finish"
            :disabled="!isSetuped">
            Fertig
          </v-btn> 
          <v-btn
            color="primary"
            @click="e1 = 2"
            :disabled="!getDirectoryJarsPath && getDirectoryJarsPath.length <= 0">
            Weiter
          </v-btn>
          
        </v-layout>
       
      </v-stepper-content>

      <v-stepper-content step="2">
        <v-card
          class="mb-1"  
          height="200px"
        >   
          <v-container>
            <v-subheader>
              Wähle den Ordner in dem sich die Datensätze (TSP, SOP) befinden
            </v-subheader>
            <v-text-field
              :value="short(getDirectoryDatasetsPath)"
              @click:append="openFileDialog('dataset')"
              @input="(val) => setPath(val, 'dataset')"
              outline
              append-icon="folder_open"
              clearable
              single-line
              >
            </v-text-field>
          </v-container>
        </v-card>

        <v-layout>
          <v-btn
            color="primary"
            @click="e1 = 1">
            Zurück
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            @click="finish"
            :disabled="!isSetuped">
            Fertig
          </v-btn>

          <v-btn
            color="primary"
            @click="e1 = 3"
            :disabled="!getDirectoryDatasetsPath && getDirectoryDatasetsPath.length <= 0"
          >
            Weiter
          </v-btn>
        </v-layout>
      </v-stepper-content>

       <v-stepper-content step="3">
        <v-card
          class="mb-1"  
          height="200px"
        >   
          <v-container>
            <v-subheader>
              <p>Wähle einen <strong>leeren/neuen Ordner</strong> in dem die Ergebnisse der Durchläufe gespeichert werden</p>
            </v-subheader>
            <v-text-field
              :value="short(getDirectorySavesPath)"
              @click:append="openFileDialog('results')"
              @input="(val) => setPath(val, 'results')"
              outline
              append-icon="folder_open"
              clearable
              single-line
              >
            </v-text-field>
          </v-container>
        </v-card>

        <v-layout>
          <v-btn
            color="primary"
            @click="e1 = 2">
            Zurück
          </v-btn>
          <v-spacer></v-spacer>
         
          <v-btn
            color="primary"
            @click="finish"
            :disabled="!isSetuped"
          >
            Fertig
          </v-btn>
        </v-layout>
       
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
    ...mapGetters(['getDirectoryDatasetsPath', 'getDirectoryJarsPath', 'isSetuped', 'getDirectorySavesPath']),
  },
  methods: {
    ...mapMutations(['setDirectoryJars', 'setDirectoryDatasets', 'setDirectorySaves']),
    finish(){
      this.$emit('finish');
    },
    setPath(path, type){
      if(type === 'algorithm'){
        this.setDirectoryJars(path ? path : "");
      }else if(type === 'results'){
        this.setDirectorySaves(path ? path : "");
      }else{
        this.setDirectoryDatasets(path ? path : "");
      }
    },
    openFileDialog(type){
      const options = {
        properties: ['openFile', 'openDirectory', 'showHiddenFiles', 'multiSelections'],
        defaultPath: type === 'algorithm' ? this.getDirectoryJarsPath : this.getDirectoryDatasetsPath,
      };
      options.defaultPath = options.defaultPath.length ? options.defaultPath : "C:/";
      this.$electron.remote.dialog.showOpenDialog(options,( paths ) => {
        if(paths){
          this.setPath(paths[0], type);
        }
      });      
    },
    short(path){
      if(path.length === 0) return "";
      const split = path.split(/\/|\\/);
      return "/" + split.slice(split.length - 3, split.length).join("/");
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

  .theme--light.v-icon:hover{
    color: white;
  }
</style>
