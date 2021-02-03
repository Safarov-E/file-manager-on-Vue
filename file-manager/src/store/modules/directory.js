export default {
    state:{
        directory: []
    },
    getters: {
        directory(state) {
            return state.directory
        }
    },
    mutations: {
        updateDirectory(state, paths) {
            state.directory = paths
        }
    },
    actions: {
        async fetchDirectory({commit}) {
            const res = await fetch('http://localhost:3001/users')
            const paths = await res.json()
            commit('updateDirectory', paths)
        }
    }
}