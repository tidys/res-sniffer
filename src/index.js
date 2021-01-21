const Path = require('path')
const Fs = require('fs')
const GiteeApi = require('./gitee-api')
const { Action } = GiteeApi;
require('./vue-ext');
const { Config } = require('./page/page.js')
const { store } = require('./page/store')
require('./core/settings').init();
require('./editor')
let components = {}
Config.forEach(cfg => {
    components[cfg.key] = cfg.page;
})
new Vue({
    el: '#app',
    store,
    data () {
        return {
            curPage: null,
            allPage: [],
        }
    },
    components: {
        navigation: require('./page/navigation/index'),
        ...components
    },
    created () {
        this.allPage = Config;
    },
    methods: {
        onNavigationChange (item) {
            this.curPage = item.key;
        },
        onClickBtn () {
            // GiteeApi.pagesInfo();
            // GiteeApi.get(Action.Stargazers)
        },
        onPr () {
            GiteeApi.post(Action.Pulls, {
                title: "test",
                head: 'master',
                base: 'master'
            });
        },

        analysisApk () {

        },


    }
})
