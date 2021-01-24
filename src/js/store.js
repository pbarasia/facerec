import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        message: 'From store',
        faces: {}
    },
    mutations: {
        setFacesData(state, data){
            state.faces=data
        }
    }

})

export default store