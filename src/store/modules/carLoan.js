import Api from '@/services/Api';

export default {
    namespaced: true,
    state() {
        return {
            carLoan: null,
            carLoanStatus: null,
        }
    },
    mutations: {
        setCarLoan(state, payload) {
            state.carLoan = payload
        },
        setCarLoanStatus(state, payload) {
            state.carLoanStatus = payload
        },
    },
    actions: {
        setCarLoan({ commit }, params) {
            commit('setCarLoan', params)
        },
        setCarLoanStatus({ commit }, params) {
            commit('setCarLoanStatus', params)
        },
        async getCarLoan({ commit, state }, params) {
            return await Api().get(
                `car-loans${params}`
            ).then((res) => {
                return res.data
            }).catch((err) => {
                console.log(err.message);
            });
        },
        async postCarLoan({ commit, state }, params) {
            return await Api().post(
                `car-loans`, params
            ).then((res) => {
                return res.data
            })
        },
        async editCarLoan({ commit, state }, params) {
            return await Api().put(
                `car-loans/${params.id}`, params
            ).then((res) => {
                return res.data
            })
        }
    },
    getters: {
        getCarLoan(state) {
            return state.carLoan;
        },
        getCarLoanStatus(state) {
            return state.carLoanStatus;
        },
    }
}