<template>
  <v-dialog
      @input="closed"
      :value="value"
      width="500"
    >
    <v-card>
      <v-toolbar>
        <slot name="header"></slot>
      </v-toolbar>

      <slot></slot>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green" @click="closed">Schließen</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data(){
    return {}
  },
  props: ['value'],
  methods: {
    closed(){
      this.$emit('input',  false );
    }
  }
}
</script>

<style>

</style>
