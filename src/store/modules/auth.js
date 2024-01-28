import axios from "axios";
import Cookie from 'js-cookie'
import Api from "@/services/Api";

export default {
    namespaced: true,
    state() {
        return {
            token: null,
            userId: "",
            user: {},
            detailUser: {},
            popUpHome: null
        }
    },
    mutations: {
        setToken(state, payload) {
            state.token = payload
        },
        clearToken(state) {
            state.token = null
            state.userId = null
            state.user = {}
            state.detailUser = {}
        },
        setUserId(state, payload) {
            state.userId = payload
        },
        setUser(state, payload) {
            state.user = payload
        },
        setDetailUser(state, payload) {
            state.detailUser = payload
        },
        setPopUpHome(state, payload) {
            state.popUpHome = payload
        }
    },
    actions: {
        setPopUpHome({ commit }, params) {
            commit('setPopUpHome', params)
        },
        login({ commit, dispatch }, user) {
            return Api()
                .post("login", user)
                .then((result) => {
                    commit('setToken', result.data.data.access_token)
                    Cookie.set('rl', result.data.data.rl)
                    const token = result.data.data.access_token;

                    let tokenData = token.split(".")[1];
                    const decode = JSON.parse(atob(tokenData));
                    commit('setUserId', decode.sub)
                    Cookie.set('token', token)

                    // dispatch('detailUser', decode.sub)

                    return result
                })
        },
        logout({ commit, state }) {
            return Api().post('logout', {}).then((res) => {
                commit('clearToken')
                Cookie.remove('token')
                Cookie.remove('rl')
                return res
            }).catch((err) => {
                console.log(err.response);
            })
        },
        async detailUser({ commit, dispatch }, params) {
            return await Api().get(`get-account?id=${params}`).then(res => {
                commit('setDetailUser', res.data.data)
                return res
                // console.log(res.data.data);
            })
        },
        async register({ }, params) {
            return await Api().post(`register`, params).then((res) => {
                return res.data
            })
        },
        async generateCookie() {
            // mengambil token dengan cookie->ambil id->hit api berdasarkan id,

            const token = Cookie.get("token");
            let tokenData = token.split(".")[1];
            const decode = JSON.parse(atob(tokenData));
            return decode;
        }
    },
    getters: {
        getUser(state) {
            return state.user;
        },
        getUserDetail(state) {
            return state.detailUser;
        },
        getPopUpHome(state) {
            return state.popUpHome;
        }
    }
}