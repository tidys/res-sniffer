const Path = require('path')
const Fs = require('fs')
const axios = require('axios')
const Action = {
    Stargazers: 'stargazers',// 谁star了该仓库
    Pulls: 'pulls', // 创建pr
    PagesInfo: 'pages', // 获取pages信息
    PagesBuilds: 'pages/builds', // 新建pages服务
    CreateFile: 'contents', // 创建文件
    RepoTree: 'git/trees',
    FileUrl: 'git/blobs', // 获取文件路径
    DeleteFile: 'contents'
};
module.exports = {
    isLimited: false,
    Action,
    _fillingUrl (action) {
        const { Owner, Repo } = require('./core/settings');
        return `https://gitee.com/api/v5/repos/${Owner}/${Repo}/${action}`;
    },
    _onCatch (e) {
        const { status } = e.request;
        if (status === 403) {
            debugger
            // 访问受限，24小时后自动解除
            this.isLimited = true;
        }
    },
    async get (action) {
        let url = this._fillingUrl(action)
        return await axios.get(url)//.catch(this._onCatch);
    },
    async post (action, data) {
        let url = this._fillingUrl(action)
        return await axios.post(url, data)//.catch(this._onCatch);
    },
    async put (action, data) {
        let url = this._fillingUrl(action)
        return await axios.put(url, data)//.catch(this._onCatch);
    },
    async delete (action, data) {
        let url = this._fillingUrl(action);
        return await axios.delete(url, { data })//.catch(this._onCatch)
    },
    async deleteFile (file) {
        if (this.isLimited) {
            return null;
        }

        const { Token } = require('./core/settings');
        return await this.delete(`${Action.DeleteFile}/${file}`, {
            access_token: Token,
        })
    },

    pages () {

    },
    pagesInfo () {
        if (this.isLimited) {
            return null;
        }
        this.get(Action.PagesInfo).then(({ data }) => {
            const { status, url } = data;
            if (status === 'built') {
                console.log('开启pages服务')
            } else if (status === 'building') {
                console.log('暂停pages服务')
            }
        });
    },
    async getFileUrl (blob) {
        return await this.get(`${Action.FileUrl}/${blob}`);
    },
    async getRepoTree () {
        if (this.isLimited) {
            return null;
        }
        let branch = 'master';
        return await this.get(`${Action.RepoTree}/${branch}`)
    },
    async testRepoTree (cfg) {

    },
    async createFile (filePath) {
        if (this.isLimited) {
            return null;
        }

        const { Token } = require('./core/settings');
        let fileExt = Path.extname(filePath);
        let fileName = Path.basename(filePath, fileExt);
        if (!Fs.existsSync(filePath)) {
            return console.log('文件不存在')
        }
        // 有100M的限制

        let buffer = Fs.readFileSync(filePath)
        let base64 = Buffer.from(buffer).toString('base64')
        // 统一放  在根目录
        // let id = new Date().getTime();
        const MD5 = require('./md5');
        let id = MD5.fileMD5(filePath)
        let url = `${Action.CreateFile}/${fileName}-${id}${fileExt}`;
        const { data } = await this.post(url, {
            access_token: Token,
            content: base64,
            message: '新建文件',
        })
        let remoteUrl = null;
        if (data.content) {
            remoteUrl = data.content['download_url'];
        }
        return {
            url: remoteUrl,
            data: data,
        }
    },


}
