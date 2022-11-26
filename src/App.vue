<template>
  <v-app>
    <v-content>
      <navbar></navbar>
    </v-content>
  </v-app>
</template>

<script>
import navbar from './components/navbar.vue'

export default {
  name: 'App',
  components: {
    navbar,
  },
  data: () => ({
    //
  }),
};
</script>
