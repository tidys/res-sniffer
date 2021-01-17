const Path = require('path')
const Fs = require('fs')
const GiteeApi = require('./gitee-api')
const { Action } = GiteeApi;
require('./vue-ext');
const { Config } = require('./page/page.js')
const { store } = require('./page/store')
require('./core/settings').init();

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
                let { url } = await GiteeApi.createFile(file)
                console.log(url)
            })
        },
        onDragOver (event) {
            event.preventDefault();
            // event.stopPropagation();
        },
        analysisApk () {

        },
        async onCrawlingApk () {
            let apk = '1.apk'
            let dir = '/Users/xyf/Desktop/apk/';
            let apkFile = Path.join(dir, apk);

            if (Fs.existsSync(apkFile)) {
                const { zip } = require('compressing')
                const MD5 = require('./md5')

                // 解压apk
                let zipTarget = Path.join(dir, MD5.fileMD5(apkFile))
                if (!Fs.existsSync(zipTarget)) {
                    await zip.uncompress(apkFile, zipTarget)
                }
                // 分析apk，过滤出图片，声音
                Path.join(zipTarget, 'assets');
                const globby = require('globby');
                let patterns = ['png', 'jpeg', 'mp3', 'wav', 'ogg', 'jpg'].map((ext) => {
                    return `${zipTarget}/**/*.${ext}`
                });
                let files = await globby(patterns, { nodir: true });
                console.log('一共：', files.length);
                // 通过md5过滤出重复的文件
                let filterFiles = {}
                files.forEach(file => {
                    let md5 = MD5.fileMD5(file);
                    if (filterFiles.hasOwnProperty(md5)) {
                        filterFiles[md5].repeat.push(file);
                    } else {
                        filterFiles[md5] = { file: file, repeat: [] };
                    }
                });
                for (let key in filterFiles) {
                    const { file, repeat } = filterFiles[key];
                    if (repeat.length > 1) {
                        // console.log(filterFiles[key])
                    }
                    let ret = await GiteeApi.createFile(file)
                    console.log(ret)
                    break;
                }

                // 文件上传到给gitee


            }

            return;

            let apkUrl = 'https://imtt.dd.qq.com/16891/apk/1B509379403078C313A499806AED20F2.apk?fsname=com.pfu.popstar_8.5.2_8520.apk&csr=1bbd';
            require('axios').get(apkUrl, {
                responseType: 'arraybuffer',
                onDownloadProgress (progressEvent) {
                    let { loaded, total } = progressEvent;
                    console.log(total)
                }
            }).then(res => {
                Fs.writeFileSync(apkFile, Buffer.from(res.data))
            })

        },

    }
})
