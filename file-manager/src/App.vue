<template>
  <div id="app">
    <Readdir />
  </div>
</template>

<script>
import Readdir from './components/readdir.vue'

export default {
  components: {
    Readdir
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 60px auto;
  width: 1200px;
}
</style>
