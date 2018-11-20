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
        @click="forceSetup = true"
        >
        <v-icon>settings</v-icon>
      </v-btn>
    </v-toolbar>
    <my-dialog v-if="forceSetup" @finish="save"></my-dialog>

    <v-content  >
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
import hsHannoverJpg from './assets/ep4-blur.jpg'
import hshLogo from './assets/HsHLogoWhite.png'
import MyDialog from './components/Dialog';
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'App',
  components: {
    MyDialog
  },
  data () {
    return {
      forceSetup: !this.isSetuped,
      isOnStartScreen: true,
      hsHannoverJpg,
      hshLogo
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
  watch: {
    isSetuped(){
      this.forceSetup = !this.isSetuped;
    }
  },
  mounted(){
    this.$router.beforeEach((to, from, next) => {
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

