<template>
  <div class="hello">
    <ul>
      <li v-for="(item, index) in directory" :key="index">
        <p>{{item.file}}</p>
        <p>{{item.size}}</p>
        <p>{{item.birthtime | fileDate}}</p>
      </li>
    </ul>
  </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'
export default {
  data() {
    return {
      data: []
    }
  },
  computed: mapGetters(['directory']),
  methods: mapActions(['fetchDirectory']),
  filters: {
    fileDate(value) {
      return value.replaceAll('-', '.').replaceAll('T', ' ').slice(0, 19)
    }
  },
  async mounted() {
    this.fetchDirectory()
  }
}
</script>
<style scoped>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  ul li {
    list-style-type: none;
    display: flex;
    justify-content: space-around;
  }
</style>