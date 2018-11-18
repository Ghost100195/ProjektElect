<template>
  <v-container justify-center fill-height>
    <v-layout row align-center justify-space-around>
      <v-flex xs3>   
        <v-btn @click="$router.push('/run')" class="card-button">
          <v-icon xs12 size="200">directions_run</v-icon>
        </v-btn>
        <div class="card-button-subtitle xs12">Auswertung</div>
      </v-flex>
      <v-flex xs3>
            
        <v-btn @click="$router.push('/chart')" class="card-button">
          <v-icon xs12 size="200">bar_chart</v-icon>
        </v-btn>
        <div class="card-button-subtitle xs12">Visualisierung</div>
      </v-flex>
    </v-layout>

      


  </v-container>
</template>

<script>
  // directions_run
  // bar_chart

  export default {
    components: {
   
    }
  }
</script>

<style>
  .card-button-subtitle{
    background: rgba(0,0,0,0.8);
    color: white; 
    width: 200px; 
    padding: 0; 
    text-align: center;
    align-content: center;
    font-size: 1.25em;
  }

  .theme--light.v-btn:not(.v-btn--icon):not(.v-btn--flat).card-button{
    background: rgba(0,0,0,0.4); 
    width: 200px; 
    height: 200px; 
    margin: 0;
  }
</style>

