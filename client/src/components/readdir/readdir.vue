<template>
  <div class="hello">
    <div class="search-container">
      <input
        type="text"
        v-model.trim ="isdirectory"
        class="search-container__input"
      />
      <button @click="pathDirectoryInput" class="search-container__button">
        Перейти
      </button>
    </div>

    <hr style="margin-top: 15px" />
    <div class="groupable-buttons">
      <button
        @click="returnDirectories"
        :disabled="returnToDirectory"
        :style="{ background: returnToDirectory ? '#7983ff' : '#5864ff' }"
      >
        Перехода в родительскую директорию
      </button>
      <div class="action-btn">
        <button @click="showfolder = true">Создать папку</button>
        <button @click="showFile = true">Создать Файл</button>
        <button @click="showDeleteFolder = !showDeleteFolder">Удалить</button>
      </div>
    </div>

    <hr style="margin-top: 15px" />
    <div class="copy-files">
      <button
        @click="fileSelection"
        :disabled="!copyFile ? false : true"
        :class="
          !copyFile ? 'copy-files__button' : 'copy-files__button_disabled'
        "
      >
        Скопировать
      </button>
      <button
        @click="insertFile"
        :disabled="copyFile ? false : true"
        :class="
          !copyFile ? 'copy-files__button_disabled' : 'copy-files__button'
        "
      >
        Переместить
      </button>
    </div>

    <div class="device-selection">
      <p>Устройства и диски:</p>
      <select @change="getFolders(disc + '/')" v-model="disc">
        <option style="display: none" selected></option>
        <option v-for="(disk, index) in diskSelection" :key="index">
          {{ disk }}
        </option>
      </select>
    </div>

    <Loader v-if="loading" />
    <div
      class="container"
      @contextmenu.prevent="actionsDirectory($event)"
      v-else
    >
      <div class="listing-actions" v-show="display">
        <ul class="listing-action">
          <li class="delete" @click="deleteFile">Удалить</li>
          <li
            class="rename"
            @click="
              (display = false),
                (modalRename = true),
                (newNameFile = oldFileName)
            "
          >
            Переменовать
          </li>
        </ul>
      </div>

      <ul class="listing-head">
        <li class="listing-head-selection">Document Name <span></span></li>
        <li class="listing-head-selection">Size <span></span></li>
        <li class="listing-head-selection">Last Edit <span></span></li>
      </ul>
      <div v-if="directory.length == 0" class="heading-title">
        <h2>Это папка пуста.</h2>
      </div>
      <ul class="directory__list" v-else>
        <li
          v-for="(item, index) in directory"
          :key="index"
          class="directory__list-item"
        >
          <input
            v-if="showDeleteFolder"
            type="checkbox"
            @click="handlerDeleteFolder(item.file)"
          />
          <input
            v-if="dataSelection"
            type="checkbox"
            @click="copyСontent(item.file)"
          />

          <a
            :href="item.file"
            @click.prevent="nextFolder(item.file)"
            class="directory__list-title"
          >
            {{ item.file }}</a
          >
          <p class="directory__list-size">{{ item.size | sizeData }}</p>
          <p class="directory__list-data">{{ item.birthtime | fileDate }}</p>
        </li>
      </ul>
    </div>

    <div class="modal-rename" v-show="modalRename">
      <div class="modal-rename__content">
        <div class="modal-rename__input">
          <img src="../../assets/edit.png" />
          <input type="text" v-model="newNameFile" />
        </div>
        <button class="modal-button__canceling" @click="modalRename = false">
          Отмена
        </button>
        <button class="modal-button__rename" @click="onRenameFile">
          Перемновать
        </button>
      </div>
    </div>

    <div class="modal-rename" v-show="errorMessage">
      <div class="modal-rename__content">
        <img src="../../assets/error.png" alt="not-found" width="150px" />
        <p class="not-found-text">
          Невозможно прочесть содержимое файла или папки
        </p>
        <button class="copy-files__button" @click="returnDirectories">
          Продолжить
        </button>
      </div>
    </div>

    <div class="modal-rename" v-if="showfolder">
      <div class="modal-rename__content">
        <div class="modal-rename__input">
          <img src="../../assets/folder.png" />
          <input type="text" v-model="folder_name" />
        </div>
        <button class="modal-button__canceling" @click="handlerClose">
          Отмена
        </button>
        <button class="modal-button__rename" @click="handlerCreateFolder">
          Создать
        </button>
      </div>
    </div>

    <div class="modal-rename" v-if="showFile">
      <div class="modal-rename__content">
        <div class="modal-rename__input">
          <img src="../../assets/edit.png" />
          <input type="text" v-model="file_name" />
        </div>
        <button class="modal-button__canceling" @click="handlerClose">
          Отмена
        </button>
        <button class="modal-button__rename" @click="handlerCreateFile">
          Создать
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import "./expansion.css";
import "./readdir.css";
import ApiService from "../../services/api";
import Loader from "../loader/loader";
import { getFolder } from "../../services/api.js";
export default {
  data() {
    return {
      apiService: new ApiService(),
      directory: [],
      isdirectory: "",
      errorMessage: false,
      diskSelection: [],
      disc: "",
      folder_name: "",
      file_name: "",
      showfolder: false,
      showFile: false,
      showDeleteFolder: false,
      dataSelection: false,
      copyFile: "",
      display: false,
      nameDeleteFile: "",
      oldFileName: "",
      modalRename: false,
      newNameFile: "",
      loading: true,
    };
  },
  components: { Loader },
  computed: {
    returnToDirectory() {
      return this.isdirectory.length <= 3 ? true : false;
    },
  },
  methods: {
    nextFolder(value) {
      if (value && value != this.isdirectory) {
        this.isdirectory = this.isdirectory + "/" + value;
      }
      this.getFolders(this.isdirectory);
    },
    async getFolders(path) {
      this.isdirectory = path;
      try {
        const response = await this.apiService.getFolder(
          JSON.stringify({ path })
        );
        this.loading = false;
        this.directory = response;
      } catch (e) {
        this.errorMessage = true;
        console.clear();
      }
    },
    returnDirectories() {
      var str = this.isdirectory;
      str = str.replace(/\\/g, "/");
      if (str.length > 3) {
        str = str.split("/");
        str.pop();
        str = str.join("/");
      }
      if (str.length < 3) str = str + "/";
      if (str.length < 2) str = this.diskSelection[0] + "/";
      this.isdirectory = str;
      this.nextFolder("");
      this.errorMessage = false;
    },
    pathDirectoryInput() {
      if (this.isdirectory.trim() != "") {
        this.loading = true;
        this.apiService
          .getPath(JSON.stringify({ path: this.isdirectory.trim() }))
          .then((res) => (this.loading = false));
        this.nextFolder("");
        this.display = false;
      }
    },
    async currentDirectory() {
      const res = await this.apiService.getCurrentDirectory();
      return res.join("");
    },
    handlerClose() {
      this.showfolder = false;
      this.showFile = false;
    },

    handlerCreateFolder() {
      if (this.folder_name.trim() !== "") {
        this.loading = true;
        let folderName = this.isdirectory + "/" + this.folder_name;
        this.apiService
          .createFolder(JSON.stringify({ folderName }))
          .then((res) => {
            this.loading = false;
            this.nextFolder("");
          });
        this.folder_name = "";
        this.handlerClose();
      }
    },
    handlerCreateFile() {
      if (this.file_name.trim() !== "") {
        this.loading = true;
        this.file_name = this.isdirectory + "/" + this.file_name;
        this.apiService
          .createFile(JSON.stringify({ file_name: this.file_name }))
          .then((res) => {
            this.loading = false;
            this.nextFolder("")
          });
        this.file_name = "";
        this.handlerClose();
      }
    },
    handlerDeleteFolder(item) {
      this.loading = true
      const fileName = this.isdirectory + "/" + item;
      this.apiService.deleteContent(JSON.stringify({ fileName }))
      .then(res => {
        this.loading = false
        this.nextFolder("")
      })
      this.showDeleteFolder = false;
    },
    copyСontent(value) {
      this.copyFile = this.isdirectory + "/" + value;
      this.dataSelection = false;
    },
    fileSelection() {
      this.dataSelection = true;
    },
    async insertFile() {
      this.loading = true;
      const res = await this.apiService.moveContent(
        JSON.stringify({
          oldfile: this.copyFile,
          newFile: this.isdirectory,
        })
      )
      this.loading = false
      this.nextFolder("");
      this.showDeleteFolder = false;
      this.copyFile = "";
    },
    actionsDirectory(event) {
      let block = document.querySelector("div.listing-actions");
      if (event.target.classList.contains("directory__list-title")) {
        this.display = true;
        this.oldName = event.target.textContent;
        block.style.position = "fixed";
        block.style.left = event.clientX + "px";
        block.style.top = event.clientY + "px";
        block.style.display = "block";
        this.oldFileName = event.target.textContent;
      } else {
        this.display = false;
      }
    },
    deleteFile() {
      this.loading = true
      const fileName = this.isdirectory + "/" + this.oldFileName.trim();
      this.apiService.deleteContent(JSON.stringify({ fileName }))
        .then(res => {
           this.loading = false
          this.nextFolder("")
        })
      this.display = false;
    },
    onRenameFile() {
      if (this.newNameFile.length >= 2) {
        let old_name = this.isdirectory + "/" + this.oldFileName.trim();
        let new_name = this.isdirectory + "/" + this.newNameFile.trim();
        this.apiService.rename(
          JSON.stringify({ oldName: old_name, newName: new_name })
        ).then(res => this.nextFolder(""))
        this.nextFolder("")
        this.modalRename = false;
      }
    },
  },
  filters: {
    fileDate(value) {
      return value.replaceAll("-", ".").replaceAll("T", " ").slice(0, 19);
    },
    sizeData(value) {
      if (value === 0) return "<Папка>";
      let i = 0;
      const type = ["б", "Кб", "Мб", "Гб", "Тб"];
      while ((value / 1000) | 0 && i < type.length - 1) {
        value /= 1024;
        i++;
      }
      return value.toFixed(1) + " " + type[i];
    },
  },
  async mounted() {
    this.isdirectory = await this.currentDirectory();
    this.nextFolder(this.isdirectory);
    this.apiService
      .getDiskSelection()
      .then((res) => (this.diskSelection = res));
  },
};
</script>