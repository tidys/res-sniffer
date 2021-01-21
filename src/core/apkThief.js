const Path = require('path')
const Fs = require('fs-extra')
const Electron = require('electron')
const URL = require('url')
const MD5 = require('../md5')

module.exports = {
    get tempDir () {
        let dir = Path.join(Electron.remote.app.getPath('userData'), 'apk-temp');
        Fs.ensureDirSync(dir);
        return dir;
    },

    async collectRes (apkFile) {
        let res = { image: [], audio: [], font: [] };
        if (Fs.existsSync(apkFile)) {
            let fileName = Path.basename(apkFile, Path.extname(apkFile))
            const { zip } = require('compressing')
            // 解压apk
            let zipTarget = Path.join(this.tempDir, fileName)
            if (!Fs.existsSync(zipTarget)) {
                await zip.uncompress(apkFile, zipTarget)
            }
            // 分析apk，过滤出图片，声音
            Path.join(zipTarget, 'assets');
            const globby = require('globby');
            let imageType = ['.png', '.jpeg', '.jpg'];
            let audioType = ['.mp3', '.wav', '.ogg'];
            let patterns = imageType.concat(audioType).map((ext) => {
                return `${zipTarget}/**/*${ext}`
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
                let ext = Path.extname(file);
                if(imageType.find(el=>el===ext)){
                    res.image.push(file);
                }else if(audioType.find(el=>el===ext)){
                    res.audio.push(fileName);
                }
            }
            return res;
        }
    },
    async downloadApk (apkUrl, cb) {
        let ret = URL.parse(apkUrl);
        let name = Path.basename(ret.pathname);
        let apkFile = Path.join(this.tempDir, name);
        if (Fs.existsSync(apkFile)) {
            cb({ loaded: 100, total: 100 });
        } else {
            let res = await require('axios').get(apkUrl, {
                responseType: 'arraybuffer',
                onDownloadProgress (progressEvent) {
                    cb && cb(progressEvent);
                }
            });
            Fs.writeFileSync(apkFile, Buffer.from(res.data))
        }
        return apkFile;
    }
}
