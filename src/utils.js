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
    }
}
