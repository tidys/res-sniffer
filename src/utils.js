const Fs = require('fs-extra')
const OS = require('os')
module.exports = {
    ff () {
        const fs = require('fs');

        //编码
        function base64_encode (file) {
            let bitmap = fs.readFileSync(file);
            return new Buffer(bitmap).toString('base64');
        }

        //解码
        function base64_decode (base64str, file) {
            var bitmap = new Buffer(base64str, 'base64');
            fs.writeFileSync(file, bitmap);
        }
    },
    getImgBase64 (imagePath, cb) {
        function image2Base64 (img) {
            let canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            let ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, img.width, img.height);
            return canvas.toDataURL("image/png");
        }

        let img = new Image();
        img.src = imagePath;
        img.onload = () => {
            let base64 = image2Base64(img);
            cb && cb(base64);
        }
    },
    openFile (fullPath) {
        if (Fs.existsSync(fullPath)) {
            if (OS.platform() === 'win32') {
                // todo myvscode path
                let vsCode = 'D:\\Microsoft VS Code\\Code.exe';
                if (!Fs.existsSync(vsCode)) {
                    return;
                }
                let cmd = `"${vsCode}" "${fullPath}"`;
                require('child_process').exec(cmd);
            } else {
                // todo mac打开配置文件
                let cmd = `open "${fullPath}"`;
                require('child_process').exec(cmd);
            }
        } else {
            console.log(`配置文件不存在:${cfgUUID}`);
        }
    },
    openPath (fullPath) {
        if (typeof fullPath !== 'string' || !Fs.existsSync(fullPath)) {
            // todo: throw
            console.error(`unable to open, Invalid path :${fullPath}`);
            return;
        }
        const platform = OS.platform();
        if (platform === 'win32') {
            require('child_process').exec(`start "" "${fullPath}"`);
        } else {
            require('child_process').exec(`open "${fullPath}"`);
        }
    },
}
