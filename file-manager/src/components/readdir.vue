<template>
  <div class="hello">
    <ul>
      <li v-for="(item, index) in directory" :key="index">
        <a :href="item.file" @click.prevent="nextFolder(item.file)">{{item.file}}</a>
        <p>{{item.size}}</p>
        <p>{{item.birthtime | fileDate}}</p>
      </li>
    </ul>
  </div>
</template>

<script>
import './expansion.css'
import './readdir.css'
export default {
  data() {
    return {
      directory: []
    }
  },
  computed: {},
  methods: {
    nextFolder(value) {
      var xhr = new XMLHttpRequest();
      xhr.open("POST", "http://localhost:3001/routes/folder", true);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xhr.send("param=" + JSON.stringify({ name: value }));
    }
  },
  filters: {
    fileDate(value) {
      return value.replaceAll('-', '.').replaceAll('T', ' ').slice(0, 19)
    }
  },
  async mounted() {
    const res = await fetch('http://localhost:3001/routes')
    const paths = await res.json()
    this.directory = paths
  }
}
</script>