<template>
   <v-dialog
      v-model="dialog"
      width="900"
    >

      <v-card>
        <v-toolbar>
          <v-subheader>Programm Ausgabe</v-subheader>
          <v-spacer></v-spacer>
          <v-btn @click="filterLibraryOutput = !filterLibraryOutput" flat>
            {{ filterLibraryOutput ? "Zeige Library Ausgabe" : "Filter Library Ausgabe"}}
          </v-btn>
        </v-toolbar>

        <v-container>
          <v-textarea
            :style="{overflow: 'scroll-y', color: item.status === 'error' ? 'red' : 'black'}"
            outline
            label="Console Ausgabe"
            name="input-7-1"
            :value="processedRaw"
          ></v-textarea>
        </v-container>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="$emit('close')" flat>Schließen</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script>
import { isLibraryOutput } from '../util/process.js';
export default {
  data () {
    return {
      filterLibraryOutput: false
    }
  },
  props: ['item'],
  computed: {
    processedRaw(){
      if(!this.item) return "";
      return this.item
              .raw.reduce((acc, crr) => { 
                if(this.filterLibraryOutput && isLibraryOutput(crr)){
                  return acc;
                } 
                acc += crr + "\n"; 
                return acc;
              }, "");
    }, 
    dialog: {
      get(){
        return !!this.item;
      },
      set(){
        this.$emit('close');
      }
    }
  }

}
</script>

<style>

</style>
