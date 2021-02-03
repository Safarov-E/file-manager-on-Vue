<template>
  <div class="hello">
    <ul>
      <li v-for="(item, index) in directory" :key="index">
        <a :href="item.file">{{item.file}}</a>
        <p>{{item.size}}</p>
        <p>{{item.birthtime | fileDate}}</p>
      </li>
    </ul>
  </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'
import './expansion.css'
import './readdir.css'
export default {
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