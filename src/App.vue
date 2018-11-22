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
        <h1 v-if="actualPath === '/run'">Auswertung Information</h1>
        <h1 v-if="actualPath === '/'">Menü Information</h1>
      </template>

      <v-container v-if="actualPath === '/chart'">
          <h3>Auswahl Daten</h3>
          <div class="box" style="margin-bottom: 10px;">
            <p>Die Auswahl von Datensätzen und Algorithmen kann durch ein Klick auf <strong>Datensätze</strong> aufgerufen werden.</p>
            <p>Falls ein Datensatz oder Algorithmus bei der Auswahl des jeweiligen anderen verschwindet, gibt es keine Daten für eine solche Kombination.</p> 
          </div>

          <h3>Standardabweichung</h3>
          <div class="box" style="margin-bottom: 10px;">
            <p>Nach Auswahl von Datensatz und Algorithmus kann die Standardabweichung durch einen Klick auf <strong>Standardabweichung</strong> berechnet werden.</p>
            <p>Durch einen erneuten Klick auf <strong>Standardabweichung</strong> können die Graphen wieder entfernt werden.</p>
          </div>

          <h3>MinMax</h3>
          <div class="box" style="margin-bottom: 10px;">
            <p>Nach Auswahl von Datensatz und Algorithmus kann der schlechteste sowie der beste Durchlauf durch einen Klick auf <strong>MinMax</strong> angezeigt werden.</p>
            <p>Durch einen erneuten Klick auf <strong>MinMax</strong> können die Graphen wieder entfernt werden.</p>
          </div>
      </v-container>

       <v-container v-if="actualPath === '/run'">
          <h3>Einstellung</h3>
          <div class="box" style="margin-bottom: 10px;">
            <h4>Algorithmen</h4>
            <div class="box">
              <p>Alle Algorithmen (jars) die in dem angegebenen Ordner gefunden werden, werden hier aufgelistet. Die Auswahl mehrerer ist möglich.</p>
            </div>

            <h4>Datensatz</h4>
            <div class="box">
              <p>Alle Datensätze (TSP oder SOP) die in dem angegebenen Ordner gefunden werden, werden hier aufgelistet. Es kann immer nur ein Datensatz gewählt werden.</p>
            </div>

            <h4>Wiederholungen</h4>
            <div class="box">
              <p>Jeder ausgewählte Algorithmus wird so häufig wiederholt wie hier angegeben wird.</p>
            </div>

            <h4>Threads</h4>
            <div class="box">
              <p>Hierbei kann gewählt werden wie viele Durchläufe gleichzeitig ausgeführt werden sollen. ( max. 6 ) </p>
            </div>
          </div>

          <h3>Prozess Warteschlange</h3>
          <div class="box" style="margin-bottom: 10px;">
            <h4>Liste</h4>
            <div class="box">
              <p>Hier werden alle offenen Prozesse angezeigt.</p>
              <p>Prozesse mit einem grünen Pfeil, befinden sich zurzeit in der Ausführung.</p>
              <p>Prozesse mit einem orangenen Pfeil, warten noch auf ihre Ausführung.</p>
            </div>

            <h4>Stop</h4>
            <div class="box">
              <p>Alle wartenden Prozesse werden abgebrochen, alle laufenden werden zuende geführt.</p>
            </div>
          </div>


          <h3>Historie</h3>
          <div class="box" style="margin-bottom: 10px;">
            <h4>Liste</h4>
            <div class="box">
              <p>Eine Aufführung aller abgeschlossenen Prozesse.</p>
              <p>Erfolgreiche Prozesse werden mittels grün dargestellt.</p>
              <p>Prozesse die fehlgeschlagen sind, werden mittels rot symbolisiert.</p>
              <p>Der Output der Prozesse kann mittels eines klicks auf den jeweiligen Prozess betrachtet werden.</p>
            </div>

            <h4>Löschen</h4>
            <div class="box">
              <p>Leert die Liste, wobei alle Ergebnisse weiterhin persistent vorhanden sind.</p>
            </div>
          </div>
      </v-container>

       <v-container v-if="actualPath === '/'">
          <h3>Einstellungen</h3>
          <div class="box" style="margin-bottom: 10px;">
            <p>In den Einstellungen müsst ihr drei Ordner angeben: </p>
            <p>- einen der eure Algorithmen enthälten (falls mehrere Versionen vorhanden) </p>
            <p>- einen der die unterschiedlichen Datensätze beinhaltet (TSP, SOP)</p>
            <p>- einen in dem die Ergebnisse der Auswertung abgelegt werden <strong>(bitte hier einen leeren/neuen Ordner anlegen)</strong></p>
          </div>
          <h3>Auswertung</h3>


          <div class="box" style="margin-bottom: 10px;">
            <p>Zum Testen der Algorihtmen könnt ihr hier mehrere Durchläufe durchführen.</p>
            <p>Euer Algorithmus muss wie folgt aufrufbar sein: </p>
            <p><strong>java -jar &lt;Name.jar&gt; &lt;Weg zum Datensatz&gt; </strong></p>
          </div>

          <h3>Visualisierung</h3>
          <div class="box" style="margin-bottom: 10px;">
            Eine grafische Betrachtung der Ergebnisse eurer Durchläufe könnt ihr hier vornehmen.</p>
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
  html, body {
    overflow-y: hidden;
  }

  p{
    margin: 0;
  }

  .box{
    padding-left: 10px;
  }
</style>

