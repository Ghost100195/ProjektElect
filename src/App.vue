<template>
  <v-app  :style="{ backgroundImage: 'url(' + hsHannoverJpg + ')', backgroundSize: 'cover' }">
    <img :src="hshLogo" alt="" style="position: absolute; max-height: 500px; top: 100px; right: 50px;">
    <v-toolbar app >
    
      <v-btn 
        v-show="!isOnStartScreen"
        icon 
        @click="$router.push('/')">
        <v-icon>keyboard_arrow_left</v-icon>
      </v-btn>

      <v-toolbar-title class="headline text-uppercase">
        <span>Schwarmalgorithmen</span>
        <span class="font-weight-light">Testumgebung</span>
      </v-toolbar-title>

      <v-spacer></v-spacer>
      <v-btn 
        icon
        flat
        @click="infoDialog = true">
        <v-icon color="blue">info</v-icon>
      </v-btn>
      
      <v-btn
        icon
        flat
        @click="forceSetup = true"
        >
        <v-icon>settings</v-icon>
      </v-btn>
    </v-toolbar>
    <my-dialog v-if="forceSetup" @finish="save"></my-dialog>

    <info-dialog v-model="infoDialog">
      <template slot="header"  >
        <h1 v-if="actualPath === '/chart'">Chart Information</h1>
        <h1 v-else>Auswertung Information</h1>
      </template>

      <v-container v-if="actualPath === '/chart'">
          <h3>Auswahl Daten</h3>
          <p>Die Auswahl von Datensätzen und Algorithmen kann durch ein Klick auf <strong>Datensätze</strong> aufgerufen werden.</p>
          <p>Die Wahl eines Algorithmus kann dazu führen, dass weniger Datensätze aufgelistet werden und vise versa. </p> 
          <p>Dies bedeutet, dass es für den gewählten Algorithmus keine Ergebnisse für den verschwundenen Datensatz gab (oder anders rum). </p> 

          <h3>Standardabweichung</h3>
          <p>Nach Auswahl einer Kombination von Datensatz/Algorithmus kann die Standardabweichung durch einen Klick auf <strong>Standardabweichung</strong>, berechnet werden</p>
          <p>Diese wird dann durch eine untere und oberen Grenze im Diagramm angezeigt</p>
          <p>Durch einen erneuten Klick auf <strong>Standardabweichung</strong> können die Graphen wieder entfernt werden</p>
  
          <h3>MinMax</h3>
          <p>Nach Auswahl einer Kombination von Datensatz/Algorithmus kann der schlechteste sowie der beste Durchlauf durch einen Klick auf <strong>MinMax</strong>, angezeigt werden</p>
          <p>Der beste sowie schlechteste Durchlauf werden dann im Diagramm angezeigt</p>
          <p>Durch einen erneuten Klick auf <strong>MinMax</strong> können die Graphen wieder entfernt werden</p>
      </v-container>

       <v-container v-else>
          <h3>Einstellung</h3>
            <div style="padding-left: 10px;">
              <h4>Algorithmen</h4>
              <div style="padding-left: 10px;">
                <p>Die Auswahl der Algorithmen findet im ersten Menüpunkt statt.</p>
                <p>Hierbei ist eine Mehrfach-Auswahl möglich, indem sie mehrere Algorithmen anklicken</p> 
              </div>

              <h4>Datensatz</h4>
              <div style="padding-left: 10px;">
                <p>Die Auswahl des Datensatzes mit dem die Evaluierung durchgeführt werden soll, findet im zweiten Menüpunkt statt.</p>
                <p>Hierbei ist keine Mehrfach-Auswahl möglich!</p>
              </div>

              <h4>Wiederholungen</h4>
              <div style="padding-left: 10px;">
                <p>Die Anzahl der Wiederholungen kann im dritten Menüpunkt frei gewählt werden.</p>
                <p>Dabei wird jeder ausgewählter Algorithmus so häufig durchgeführt wie eingestellt.</p>
                <p>Beispiel: 2 Algorithmen gewählt, Wiederholung = 10 sind dann 20 Durchläufe, jeweils 10x den ersten sowie den zweiten Algorithmus</p>
              </div>
            </div>

            <h3>Process Warteschlange</h3>
            <div style="padding-left: 10px;">
              <h4>Liste</h4>
              <div style="padding-left: 10px;">
                <p>Die Liste zeigt die Anzahl der Processe an die auf ihre Fertigstellung warten.</p>
                <p>Processe mit einem Grünen Pfeil vorne, befinden sich zurzeit in der Ausführung</p>
                <p>Processe mit einem Orangenen Pfeil vorne, warten noch auf ihre Ausführung</p>
              </div>

              <h4>Stop</h4>
              <div style="padding-left: 10px;">
                <p>Stop führt dazu, dass alle Processe die noch warten entfernt und die noch laufenden Processe zu Ende geführt werden</p>
              </div>
            </div>


            <h3>Historie</h3>
            <div style="padding-left: 10px;">
              <h4>Liste</h4>
              <div style="padding-left: 10px;">
                <p>In der Liste werden alle Processe aufgeführt die erfolgreich und nicht erfolgreich durchlaufen wurden.</p>
                <p>Processe die nicht erfolgreich waren, werden mit rot markiert.</p>
                <p>Durch einen Klick auf den jeweiligen Process kann die Ausgabe des Processe betrachtet werden.</p>
                <p>Hierbei ist es auch möglich die von der Library verursachten Ausgaben heraus zu filtern.</p>
              </div>

              <h4>Löschen</h4>
              <div style="padding-left: 10px;">
                <p>Das löschen, bereinigt die Liste. Alle Daten sind weiterhin persistent verfügbar.</p>
              </div>
            </div>
      
      </v-container>


    </info-dialog>

    <v-content  >
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
import infoDialog from './components/info.vue';
import hsHannoverJpg from './assets/ep4-blur.jpg'
import hshLogo from './assets/HsHLogoWhite.png'
import MyDialog from './components/Dialog';
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'App',
  components: {
    MyDialog,
    infoDialog
  },
  data () {
    return {
      infoDialog: false,
      forceSetup: !this.isSetuped,
      isOnStartScreen: true,
      hsHannoverJpg,
      hshLogo,
      actualPath: "/"
    }
  },
  methods:{
    ...mapActions(['saveSetting', 'readSetting']),
    save(){
      this.forceSetup = false
      this.saveSetting();
    }
  },
  computed:{
    ...mapGetters(['isSetuped']),
  },
  mounted(){
    this.$router.beforeEach((to, from, next) => {
      this.actualPath = to.path;
      console.log(this.actualPath);
      this.isOnStartScreen = to.path === "/";
      next();
    })
  },
  created(){

    this.readSetting();
  }
}
</script>

<style>
  html { overflow-y: hidden; }
</style>

