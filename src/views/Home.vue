<template>
  <v-container justify-center fill-height>
    <v-layout column justify-space-between>
    
      <v-flex></v-flex>
      <v-flex>
        <v-layout row justify-space-around>
          <v-flex xs3>
            <v-btn
              color="teal"
              value="favorites"
              large
              >
              <v-icon>favorite</v-icon>
              <router-link to="/run">Testläufe</router-link>
             
            </v-btn>
          </v-flex>
          <v-flex xs3>
            <v-btn
              color="teal"
              value="favorites"
              large
              >
              <v-icon>favorite</v-icon>
              <span>Analyse</span>
              
            </v-btn>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex></v-flex>
      
    </v-layout>

  </v-container>
</template>

<script>


  export default {
    components: {
   
    }
  }
</script>

<style>

</style>

