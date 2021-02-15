<template>
  <div id="app">
    <div style="display: flex;width: 100%;margin: auto;justify-content: center;">
      <Readdir :key="1" />
      <Readdir :key="2" />
    </div>
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
  width: 100%;
  margin: 60px auto;
}
body{ 
  background-color: #f5f6f9;
}
</style>
