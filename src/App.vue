<template>
  <div id="app">
    <AppLayout />
  </div>
</template>

<script>
import AppLayout from './components/common/AppLayout.vue'

export default {
  name: 'App',
  components: {
    AppLayout
  }
}
</script>

<style lang="scss">
#app {
  height: 100vh;
  overflow: hidden;
}
</style>