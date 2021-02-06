<template>
  <div class="hello">
    {{errorMessage ? 'Невозможно прочесть содержимое файла или папки' : null}}
    {{errorMessage1 ? 'Неверно указан путь' : null}}
    <div>
        <button @click="returnDirectories">Перехода в родительскую директорию</button>
        <input type="text" v-model="isdirectory" />
        <button @click="pathDirectoryInput">Перейти</button>
    </div>
    <div class="action-btn">
      <button @click="createFolder">Создать папку</button>
      <button @click="createFile">Создать Файл</button>
      <button @click="showDeleteFolder = !showDeleteFolder">Удалить</button>
    </div>
    <select @change="onDiskSelection" v-model="disc">
      <option style="display: none" selected></option>
      <option v-for="(disk, index) in diskSelection" :key="index">{{disk}}</option>  
    </select>
    <ul>
      <li v-for="(item, index) in directory" :key="index">

        <input v-if="showDeleteFolder" type="checkbox" @click="handlerDeleteFolder(item.file)">
        
        <a :href="item.file" @click.prevent="nextFolder(item.file)">{{
          item.file
        }}</a>
        <p>{{ item.size }}</p>
        <p>{{ item.birthtime | fileDate }}</p>
      </li>
    </ul>
    
      <div class="renameFile_action1" v-if="showfolder">
        <span class="close_modal1" @click="handlerClose">&times;</span>
        <div class="inputValue1">
          <p>Введите имя папки:</p>
          <input type="text" v-model="folder_name" />
        </div>
        <div class="btn-close">
          <button class="closeBtn" @click="handlerCreateFolder">Создать</button>
        </div>
      </div>

       <div class="renameFile_action1" v-if="showFile">
          <span class="close_modal1" @click="handlerClose">&times;</span>
          <div class="inputValue1">
            <p>Введите имя файла:</p>
            <input type="text" v-model="file_name" />
          </div>
          <div class="btn-close">
            <button class="closeBtn" @click="handlerCreateFile">Создать</button>
          </div>
      </div>
      
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
      errorMessage1: false,
      diskSelection: [],
      disc: '',
      folder_name: '',
      file_name: '',
      showfolder: false,
      showFile: false,
      showDeleteFolder: false
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
      this.currentDirectory()
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
          .then(res => res.json())
          .catch(e => this.errorMessage1 = true)
          this.isdirectory = ''
          return this.nextFolder('')
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
    },
    currentDirectory() {
      fetch("http://localhost:8081/current-directory")
        .then(res => res.json())
        .then(res => this.isdirectory = res.join(''))
    },

    createFolder() { this.showfolder = true; },
    createFile() { this.showFile = true; },
    handlerClose() { 
      this.showfolder = false; 
      this.showFile = false;
    },

    handlerCreateFolder() {
      if(this.folder_name.trim() !== '') {
        let create_folder = this.isdirectory + "/" + this.folder_name;
        fetch("http://localhost:8081/create-folder", {
            method: "POST",
            body: JSON.stringify({ path: create_folder }),
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          })
        this.nextFolder('')
        this.folder_name = ''
      }
    },
    handlerCreateFile() {
      if(this.file_name.trim() !== '') {
        let create_file = this.isdirectory + "/" + this.file_name;
        fetch("http://localhost:8081/create-file", {
            method: "POST",
            body: JSON.stringify({ path: create_file }),
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }).then(res => res.json())
          .then(err => console.log('Невозможно создать файл'))
        this.nextFolder('')
        this.file_name = ''
      }
    },
    handlerDeleteFolder(item) {
      let delete_file = this.isdirectory + "/" + item;
      fetch("http://localhost:8081/delete-button", {
            method: "POST",
            body: JSON.stringify({ path: delete_file }),
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          })
      this.nextFolder('')
      this.showDeleteFolder = false;
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
        this.currentDirectory()
    }
};
</script>