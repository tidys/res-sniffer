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
        },
        onSuccess (msg) {
            this.$Notice.success({
                title: msg,
                duration: 2,
            });
        },
        onWarning (msg) {
            this.$Notice.warning({
                title: msg,
                duration: 2,
            })
        }
    }

}
