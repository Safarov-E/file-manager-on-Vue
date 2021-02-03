import Vue from 'vue'
import Vuex from 'vuex'
import directory from './modules/directory'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        directory
    }
})