const { createNamespacedHelpers } = require('vuex');
const { NameSpace } = require('../store')
const { mapGetters, mapMutations } = createNamespacedHelpers(NameSpace.Setting.name);
const Settings = require('../../core/settings');
const axios = require('axios');
module.exports = Vue.extend({
    template: Vue.readTemplate(__dirname, 'index.html'),
    name: 'settings',
    data () {
        return {
            curUser: null,
            curRepo: null,
            curToken: null,
            checking: false,
        }
    },
    created () {
        this.curRepo = Settings.Repo;
        this.curToken = Settings.Token;
        this.curUser = Settings.Owner;
    },
    methods: {
        async onConfirm () {
            this.checking = true;
            const { Action } = require('../../gitee-api');
            let cfg = {
                owner: this.curUser,
                repo: this.curRepo,
                token: this.curToken, // 暂时无法校验
            };
            // 测试star用户数据，来验证配置是否有效
            let url = `https://gitee.com/api/v5/repos/${cfg.owner}/${cfg.repo}/${Action.Stargazers}`;
            try {
                let ret = await axios.get(url);
                if (ret) {
                    Settings.save(cfg);
                    this.$Notice.success({
                        title: '保存成功',
                        duration: 1,
                    });
                }
            } catch (e) {
                this.$Notice.error({
                    title: '配置无效',
                    duration: 2,
                });
            }
            this.checking = false;
        },
    },
    computed: {}
})
