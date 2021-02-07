<template>
  <div id="app">
    <Readdir />
  </div>
</template>

<script>
import Readdir from './components/readdir/readdir.vue'

export default {
  name: 'App',
  components: {
    Readdir
  }
}
</script>

<style>
#app {
  font-family: 'IBM Plex Sans';
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 1000px;
  margin: 60px auto;
}
body{ 
  background-color: #f5f6f9;
}
</style>
