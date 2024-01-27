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
                    // dispatch('user', decode.sub)

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
        async user({ commit, state, dispatch }, params) {
            return await Api().get(`user/${params}`).then(res => {
                commit('setUser', res.data.data)
                dispatch('detailUser', { id: res.data.data.user_detail_id })
            }).catch(e => {
                console.log('silahkan login kembali');
                dispatch('logout');
            })
            // const token = Cookie.get("token");
            // let tokenData = token.split(".")[1];
            // const decode = JSON.parse(atob(tokenData));

            // const user = await Api().get(`user/${decode.sub}`);
            // const detail = await Api().get(`employees/${user.data.data.user_detail_id}`);
            // return {
            //     user: user.data.data,
            //     user_detail: detail.data.data
            // }
        },
        async detailUser({ commit, dispatch }, params) {
            return await Api().get(`employees/${params.id}`).then(res => {
                // console.log(res.data.data, 'detail user')
                commit('setDetailUser', res.data.data)
                // return res.data.data
            })
            // return Api().get(`employees/${params.id}`).then((res) => {
            //     return res.data
            // }).catch((err) => {
            //     console.log(err.response);
            // })
        },
        getAccounts({ }, params) {
            return Api().get(`accounts${params}`, {},).then((res) => {
                return res.data
            }).catch((err) => {
                console.log(err.response);
            })
        },
        getEmployees({ }, params) {
            return Api().get(`employees${params}`, {},).then((res) => {
                return res.data
            }).catch((err) => {
                console.log(err.response);
            })
        },
        async register({ }, params) {
            return await Api().post(`register`, params).then((res) => {
                return res.data
            })
        },
        async updateAccounts({ }, params) {
            return await Api().put(`accounts/${params.id}`, params).then((res) => {
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