module.exports = {
    Config: [
        { name: 'APK', key: 'apk', page: require('./apk/index') },
        { name: '仓库', key: 'repo', page: require('./repo/index') },
        { name: '设置', key: 'settings', page: require('./settings/index') },
        { name: '商城', key: 'store', page: require('./market/index') },
    ]

}
