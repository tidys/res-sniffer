const GiteeApi = require('../../gitee-api')

module.exports = Vue.extend({
    name: 'repo',
    mixins: [require('../mixin')],
    template: Vue.readTemplate(__dirname, 'index.html'),
    components: {
        res: require('./res')
    },
    data () {
        return {
            branch: null,
            allFiles: [],
        }
    },
    async created () {
        this.allFiles = [{ path: '1610267702366.png' }];
        await this.onGetRepoTree();
    },
    methods: {
        async onDeleteFile (item) {
            await GiteeApi.deleteFile(item.path);
            // let index = this.allFiles.findIndex(el => el === item);
            // this.allFiles.splice(index, 1)
        },
        // 获取仓库文件
        async onGetRepoTree () {
            let repo = await GiteeApi.getRepoTree().catch(this.onError)
            if (repo) {
                let { data } = repo;
                if (data) {
                    this.allFiles = data.tree;
                    this.branch = data.sha;
                }
            }
        }
    }
})
