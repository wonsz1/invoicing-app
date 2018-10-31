import Vue from 'vue'
import Router from 'vue-router'
import SignUp from '@/components/SignUp'
import Dashboard from '@/components/Dashboard'
import { defaultLocale } from '../config/i18n'
Vue.use(Router)

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            redirect: `/${defaultLocale}`
        },
        {
            path: '/:locale',
            component: {
                template: '<router-view />'
            },
            children: [
                {
                    path: '',
                    name: 'SignUp',
                    component: SignUp
                },
                {
                    path: 'dashboard',
                    name: 'Dashboard',
                    component: Dashboard
                }
            ]
        }
    ]
})