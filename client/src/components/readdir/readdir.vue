<template>
  <div class="hello">
    {{errorMessage ? 'Невозможно прочесть содержимое файла или папки' : null}}
    <div>
        <button @click="returnDirectories">Перехода в родительскую директорию</button>
        <input type="text" v-model="isdirectory" />
        <button @click="pathDirectoryInput">Перейти</button>
    </div>
    <select @change="onDiskSelection" v-model="disc">
      <option style="display: none" selected></option>
      <option v-for="(disk, index) in diskSelection" :key="index">{{disk}}</option>  
    </select>
    {{directory.length}}
    <ul>
      <li v-for="(item, index) in directory" :key="index">
        <a :href="item.file" @click.prevent="nextFolder(item.file)">{{
          item.file
        }}</a>
        <p>{{ item.size }}</p>
        <p>{{ item.birthtime | fileDate }}</p>
      </li>
    </ul>
  </div>
</template>

<script>
import "./expansion.css";
import "./readdir.css";
export default {
  data() {
    return {
      directory: [],
      isdirectory: '',
      errorMessage: false,
      diskSelection: [],
      disc: ''
    };
  },
  computed: {},
  methods: {
    async nextFolder(value) {
      try {
        const response = await fetch("http://localhost:8081/folder", {
          method: "POST",
          body: JSON.stringify({ path: value }),
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });
        const body = await response.json();
        this.directory = body
      } catch (e) {
        this.errorMessage = true
      }
    },
    async returnDirectories() {
        fetch("http://localhost:8081/return")
        this.nextFolder('')
    },
    pathDirectoryInput() {
      if(this.isdirectory.trim() != '') {
        fetch("http://localhost:8081/path", {
          method: "POST",
          body: JSON.stringify({ path: this.isdirectory }),
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        })
        this.isdirectory = ''
      }
    },
    onDiskSelection() {
      fetch("http://localhost:8081/new-disk", {
          method: "POST",
          body: JSON.stringify({ path: this.disc }),
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        })
      this.nextFolder('')
    }
  },
  filters: {
    fileDate(value) {
      return value.replaceAll("-", ".").replaceAll("T", " ").slice(0, 19);
    }
  },
    mounted() {
        this.nextFolder('')
        fetch("http://localhost:8081/disk-selection")
          .then(res => res.json())
          .then(res => this.diskSelection = res)
    }
};
</script>