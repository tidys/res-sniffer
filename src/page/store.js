const Vuex = require('vuex')
Vue.use(Vuex)
const NameSpace = {
    Setting: {
        name: "settings", store: require('./settings/store')
    }
};
const store = new Vuex.Store({
    modules: {
        [NameSpace.Setting.name]: NameSpace.Setting.store,
    }
})
module.exports = { store, NameSpace };
