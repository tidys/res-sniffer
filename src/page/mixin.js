module.exports = {
    methods: {
        onError (e) {
            const { status } = e.request;
            if (status === 403) {
                this.$Notice.error({
                    title: 'Gitee访问受限，24小时后自动解除',
                    duration: 2,
                });
            }
        }
    }

}
