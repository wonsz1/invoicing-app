import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex);
const env = require('../../config');

export default new Vuex.Store({
    state: {
        status: '',
        token: localStorage.getItem('token') || '',
        user: {}
    },
    // Mutators are used to change the state of a vuex store
    mutations: {
        auth_request(state) {
            state.status = 'Loading';
        },
        auth_success(state, token, user) {
            state.status = 'success';
            state.token = token;
            state.user = user;
        },
        auth_error(state) {
            state.status = 'Error';
        },
        logout(state) {
            state.status = '';
            state.token = '';
        }
    },
    actions: {
        login({commit}, formData) {
            return new Promise((resolve, reject) => {
                console.log('8888');
                console.log(env.default.SERVER_ADDR);
                commit('auth_request');
                //axios.post(env.default.SERVER_ADDR + 'login', formData)
                axios({url: env.default.SERVER_ADDR + 'login', data: formData, method: 'POST'})
                .then(res => {
                    console.log(res);
                    localStorage.setItem('token', res.data.token);
                    axios.defaults.headers.common['Authorization'] = res.data.token;
                    commit('auth_success', res.data.token, res.data.user);

                    resolve(res);
                }).catch(err => {
                    console.log(err);
                    commit('auth_error');
                    localStorage.removeItem('token')

                    reject(err);
                });
            })
        },

        register({commit}, formData) {
            return new Promise((resolve, reject) => {
                commit('auth_request');
                axios.post(env.default.SERVER_ADDR + 'register', formData)
                .then(res => {
                    localStorage.setItem('token', res.data.token);
                    axios.defaults.headers.common['Authorization'] = res.data.token;
                    commit('auth_success', res.data.token, res.data.user);

                    resolve(res);
                }).catch(err => {
                    commit('auth_error');
                    localStorage.removeItem('token');

                    reject(err);
                });
            });
        },

        logout({commit}) {
            return new Promise((resolve, reject) => {
                commit('logout');
                localStorage.removeItem('token');
                delete axios.defaults.headers.commit['Authorization'];
                resolve();
            })
        }
    },
    // The role of our getter in the situation is to separate application data from application logic 
    // and ensure we do not give away sensitive information.
    getters: {
        isLoggedIn: state => !!state.token,
        authStatus: state => state.status
    }
})