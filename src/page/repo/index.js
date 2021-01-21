const GiteeApi = require('../../gitee-api')
const Fs = require('fs')
const Path = require('path')
const { ResInfo } = require('./data')

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
    },
    async mounted () {
        // this.onTestData();
        // await this.onGetRepoTree();
    },
    methods: {
        async onDeleteFile (item) {
            await GiteeApi.deleteFile(item);
            this.onSuccess('删除成功')
            let index = this.allFiles.findIndex(el => el === item);
            this.allFiles.splice(index, 1)
        },
        onTestData () {
            this.allFiles = [];
            let resInfo = new ResInfo();
            resInfo.init({ sha: 'sha', path: 'a.png' })
            this.allFiles.push(resInfo)
        },
        // 获取仓库文件
        async onGetRepoTree () {
            let repo = await GiteeApi.getRepoTree().catch(this.onError)
            if (repo) {
                let { data } = repo;
                if (data) {
                    let allRes = [];
                    data.tree.forEach(res => {
                        let resInfo = new ResInfo();
                        resInfo.init(res);
                        allRes.push(resInfo);
                    })

                    this.allFiles = allRes;
                    this.branch = data.sha;
                }
            }
        },
        onDropOver (event) {
            let files = [];
            const data = event.dataTransfer;
            if (data.files !== undefined) {
                for (let i = 0; i < data.files.length; i++) {
                    const { name, path, type } = data.files[i];
                    let stat = Fs.statSync(path);
                    if (stat.isFile()) {
                        files.push(path)
                    } else if (stat.isDirectory()) {

                    }
                }
            }
            files.forEach(async (file) => {
                // 检查重名
                let baseName = Path.basename(file)
                let fileName = GiteeApi.getUploadFileName(file);
                let b = this.allFiles.find(item => item.path === fileName)
                if (b) {
                    this.onWarning(`[${baseName}]不能重复`);
                } else {
                    let data = await GiteeApi.createFile(file)
                    let resInfo = new ResInfo();
                    resInfo.init(data);
                    this.allFiles.push(resInfo)
                }
            })
        },
        onDragOver (event) {
            event.preventDefault();
            // event.stopPropagation();
        },

    }
})
