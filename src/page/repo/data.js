const GiteeApi = require('../../gitee-api')
const Fs = require('fs')

class ResInfo {
    constructor () {
        this.name = ''; // 文件名
        this.sha = '';
        this.path = ''; // 路径
        this.rawUrl = null; // 真实的raw下载地址
        this.fileUrl = null;// 本地磁盘的url
        this.url = null;// 浏览器请求发现都是base64数据
        this.base64Data = null;
        this.encoding = null;
        this.size = 0;
    }

    init (data) {
        this.name = data.name || '';
        this.sha = data.sha || '';
        this.path = data.path || null;
        this.size = data.size || 0;
        if (data.fileUrl && Fs.existsSync(data.fileUrl)) {
            this.fileUrl = data.fileUrl;
        } else {
            this.fileUrl = null;
        }
        if (this.path) {
            this.rawUrl = GiteeApi.previewUrl(this.path);
        } else {
            this.rawUrl = data['download_url'] || null;
        }
    }

    async getBase64Data () {
        if (!this.base64Data) {
            let { data } = await GiteeApi.getFileUrl(this.sha);
            this.size = data.size;
            this.encoding = data.encoding;
            this.base64Data = data.content;
        }
        return this.base64Data;
    }

    async imageData () {
        if (this.isImage) {
            if (this.rawUrl) {
                return this.rawUrl;
            } else if (this.fileUrl) {
                return this.fileUrl;
            } else {
                let base64 = await this.getBase64Data();
                return `data:;base64,${base64}`;
            }
        }
        return null;
    }

    get isImage () {
        let ext = Path.extname(this.path);
        let ret = ['.png', '.jpg', '.jpeg'].find(el => el === ext)
        return !!ret;
    }

}

module.exports = { ResInfo }
