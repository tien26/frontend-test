import Api from '@/services/Api';

export default {
    namespaced: true,
    state() {
        return {
            borrowingHistory: null,
            borrowingHistoryStatus: null,
        }
    },
    mutations: {
        setBorrowingHistory(state, payload) {
            state.borrowingHistory = payload
        },
        setBorrowingHistoryStatus(state, payload) {
            state.borrowingHistoryStatus = payload
        },
    },
    actions: {
        setBorrowingHistory({ commit }, params) {
            commit('setBorrowingHistory', params)
        },
        setBorrowingHistoryStatus({ commit }, params) {
            commit('setBorrowingHistoryStatus', params)
        },
        async getBorrowingHistory({ commit, state }, params) {
            return await Api().get(
                `borrowing-histories${params}`
            ).then((res) => {
                return res.data
            }).catch((err) => {
                console.log(err.message);
            });
        },
        async postBorrowingHistory({ commit, state }, params) {
            return await Api().post(
                `borrowing-histories`, params
            ).then((res) => {
                return res.data
            })
        },
        async editBorrowingHistory({ commit, state }, params) {
            return await Api().put(
                `borrowing-histories/${params.id}`, params
            ).then((res) => {
                return res.data
            })
        }
    },
    getters: {
        getBorrowingHistory(state) {
            return state.borrowingHistory;
        },
        getBorrowingHistoryStatus(state) {
            return state.borrowingHistoryStatus;
        },
    }
}