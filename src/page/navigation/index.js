let { Config } = require('../page')
module.exports = Vue.extend({
    name: 'navigation',
    template: Vue.readTemplate(__dirname, 'index.html'),
    data () {
        return {
            items: Config,
        }
    },
    created () {
        this.items.forEach(item => {
            this.$set(item, 'select', false);
        })
    },
    mounted () {
        this.onClickItem(this.items[0])
    },
    methods: {
        onClickItem (item) {
            if (!item.select) {
                this.items.forEach(el => {
                    el.select = el.key === item.key;
                })
                this.$emit('select', item);
            }
        }
    }
})
