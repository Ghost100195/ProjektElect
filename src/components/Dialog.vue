<template>
   <v-dialog
      persistent
      v-model="dialog"
      width="500"
    >
      <my-stepper
        @finish="$emit('finish')"
      ></my-stepper>
    </v-dialog>
</template>

<script>
import MyStepper from './Stepper';
export default {
  data () {
    return {
      dialog: true
    }
  },
  components: {
    MyStepper
  }

}
</script>

<style>

</style>
