const Thief = require('../../core/apkThief')

module.exports = Vue.extend({
    name: 'apk',
    template: Vue.readTemplate(__dirname, 'index.html'),
    data () {
        return {
            apkUrl: null,
            percent: 0,
            allRes: [],
        }
    },
    async created () {
        this.apkUrl = 'https://imtt.dd.qq.com/16891/apk/1B509379403078C313A499806AED20F2.apk?fsname=com.pfu.popstar_8.5.2_8520.apk&csr=1bbd';
    },
    methods: {
        onOpenDir () {
            window.Editor.Utils.openPath(Thief.tempDir)
        },
        async onThiefApk () {
            this.percent = 0;
            // 下载apk
            let fileUrl = await Thief.downloadApk(this.apkUrl, (progressEvent) => {
                let { loaded, total } = progressEvent;
                this.percent = parseInt(loaded / total * 100);
            })

            // 获取apk的资源
            const { image, audio, font } = await Thief.collectRes(fileUrl);
            console.log(image);
            let allRes = [];
            [].concat(image, audio, font).forEach(file => {
                const { ResInfo } = require('../repo/data')
                let resInfo = new ResInfo()
                resInfo.init({ fileUrl: file })
                allRes.push(resInfo)
            })
            this.allRes = allRes;
            // 文件上传到给gitee
            // let ret = await GiteeApi.createFile(file)
        },
    }
})
