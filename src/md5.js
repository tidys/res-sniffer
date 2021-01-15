const crypto = require('crypto');
const Fs = require('fs');
const Path = require('path');
let md5Len = 5;
let MD5 = {
    getMd5UrlByData (data, file, uuid) {
        let md5 = this.dataMD5(data);
        return this._genMd5Url(md5, file, uuid);
    },
    getMd5UrlByFile (filePath, uuid) {
        let md5 = this.fileMD5(filePath);
        return this._genMd5Url(md5, filePath, uuid);
    },
    _genMd5Url (md5, filePath, uuid) {
        let extName = Path.extname(filePath);
        let fileDir = `res/avg/${uuid.slice(0, 2)}`;
        let md5Url = Path.join(fileDir, `${uuid}.${md5}${extName}`);
        return md5Url.replace(/\\/g, '/');
    },
    dataMD5 (data) {
        let md5Data = null;
        if (typeof data === 'object' || Array.isArray(data)) {
            md5Data = JSON.stringify(data);
        } else if (typeof data === 'string') {
            md5Data = data;
        }
        if (md5Data) {
            let md5 = crypto.createHash('md5');
            let fullMd5 = md5.update(md5Data).digest('hex');
            return fullMd5.slice(0, md5Len);
        }
        return null;
    },
    fileMD5 (file) {
        if (Fs.existsSync(file)) {
            let md5 = this._smallFile(file);
            md5 = md5.slice(0, md5Len);
            return md5;
        }
        return null;
    },
    _smallFile (file) {
        let fileData = Fs.readFileSync(file);
        let md5 = crypto.createHash('md5').update(fileData);
        return md5.digest('hex');
    },
    _bigFile (file) {
        let md5 = crypto.createHash('md5');
        let stream = Fs.createReadStream(file);
        stream.on('data', (data) => {
            md5.update(data);
        });
        stream.on('end', () => {
            md5.digest('hex');
        });
    },
};
module.exports = MD5;
