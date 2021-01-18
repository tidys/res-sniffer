module.exports = {
    namespaced: true,
    state: {
        user: null,
        repo: null,
        token: null,
    },
    mutations: {
        init (state) {
        }
    },
    getters: {
        user (state) {
            return state.user;
        },
        repo (state) {
            return state.repo;
        },
        token (state) {
            return state.token;
        },
    }
}
