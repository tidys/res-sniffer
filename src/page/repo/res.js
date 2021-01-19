const Path = require('path')
const Fs = require('fs')
const GiteeApi = require('../../gitee-api')
const { ResInfo } = require('./data')
module.exports = Vue.extend({
    name: 'res',
    template: Vue.readTemplate(__dirname, 'res.html'),
    props: {
        data: {
            type: ResInfo,
        }
    },
    data () {
        return {
            imageSrc: null,
            isHover: false,
        }
    },
    async created () {
        console.log(this.data)
        if (this.data.isImage) {
            this.imageSrc = await this.data.imageData();
        }
    },
    methods: {
        async getImageUrl () {
        },
        // 删除文件
        onClose () {
            this.$emit('delete', this.data);
        }
    },
    computed: {}
})
