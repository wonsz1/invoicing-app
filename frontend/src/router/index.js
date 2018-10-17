import Vue from 'vue';
import Router from 'vue-router';
import SignUp from '@/componenets/SignUp';
import Dashboard from '@/componenets/Dashboard';
Vue.use(Router)

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'SignUp',
            component: SignUp
        },
        {
            path: '/dashboard',
            name: 'Dashboard',
            component: Dashboard
        }
    ]
})