<template>
    <v-dialog
      :persistent="!isSetuped"
      v-model="dialog"
      width="500"
    >
      <my-stepper
        @cancel="$emit('finish')"
        @finish="$emit('finish')"
      ></my-stepper>
    </v-dialog>
</template>

<script>
import MyStepper from './Stepper';
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
    
    }
  },
  computed: {
    ...mapGetters(['isSetuped']),
    dialog: {
      get(){
        return true;
      },
      set(val){
        if(this.isSetuped) {
          this.$emit('finish');
        }
      }
    }
  },
  methods: {

  },
  components: {
    MyStepper
  }

}
</script>

<style>

</style>
