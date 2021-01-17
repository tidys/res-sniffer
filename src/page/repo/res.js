const Path = require('path')
const Fs = require('fs')
const GiteeApi = require('../../gitee-api')

module.exports = Vue.extend({
    name: 'res',
    template: Vue.readTemplate(__dirname, 'res.html'),
    props: {
        data: {
            type: Object,
        }
    },
    data () {
        return {
            imageData: null,
            isHover: false,
        }
    },
    created () {
        console.log(this.data)
        // if (this.isImage) {
        //     GiteeApi.getFileUrl(this.data.sha).then(({ data }) => {
        //         this.imageData = 'data:image/png;base64' + data.content;
        //     });
        //
        // }
    },
    methods: {
        async getImageUrl () {
        },
        // 删除文件
        onClose () {
            this.$emit('delete', this.data);
        }
    },
    computed: {
        isImage () {
            let ext = Path.extname(this.data.path);
            let ret = ['.png', '.jpg', '.jpeg'].find(el => el === ext)
            return !!ret;
        }
    }
})
