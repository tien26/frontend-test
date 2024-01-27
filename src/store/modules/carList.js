import Api from '@/services/Api';

export default {
    namespaced: true,
    state() {
        return {
            carList: null,
            carListStatus: null,
        }
    },
    mutations: {
        setCarList(state, payload) {
            state.carList = payload
        },
        setCarListStatus(state, payload) {
            state.carListStatus = payload
        },
    },
    actions: {
        setCarList({ commit }, params) {
            commit('setCarList', params)
        },
        setCarListStatus({ commit }, params) {
            commit('setCarListStatus', params)
        },
        async getCarList({ commit, state }, params) {
            return await Api().get(
                `car-lists${params}`
            ).then((res) => {
                return res.data
            }).catch((err) => {
                console.log(err.message);
            });
        },
        async postCarList({ commit, state }, params) {
            return await Api().post(
                `car-lists`, params, { headers: { "Content-Type": "multipart/form-data" }, }
            ).then((res) => {
                return res.data
            })
        },
        async editCarList({ commit, state }, params) {
            return await Api().post(
                `car-lists/${params.id}`, params, { headers: { "Content-Type": "multipart/form-data" }, }
            ).then((res) => {
                return res.data
            })
        }
    },
    getters: {
        getCarList(state) {
            return state.carList;
        },
        getCarListStatus(state) {
            return state.carListStatus;
        },
    }
}