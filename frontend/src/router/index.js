import Vue from 'vue'
import Router from 'vue-router'
import SignUp from '@/components/SignUp'
import Dashboard from '@/components/Dashboard'
import ViewInvoice from '@/components/ViewInvoice'
import ClientList from '@/components/ClientList'
import InvoiceList from '@/components/InvoiceList'
import CreateInvoice from '@/components/CreateInvoice'
import NotFound from '@/components/NotFound'
import { defaultLocale } from '../config/i18n'
import store from '../services/store';
Vue.use(Router)


let router = new Router({
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
                },
                {
                    path: 'invoice/:id',
                    name: 'Invoice',
                    component: ViewInvoice
                },
                {
                    path: 'invoice',
                    name: 'Invoices',
                    component: InvoiceList
                },
                {
                    path: 'new-invoice',
                    name: 'CreateInvoice',
                    component: CreateInvoice
                },
                {
                    path: 'client',
                    name: "Clients",
                    component: ClientList
                }
            ]
        },
        {
            path: '*',
            name: 'NotFound',
            component: NotFound
        }
    ]
})

router.beforeEach((to, from, next) => {
    if(to.matched.some(record => record.meta.requiresAuth)) {
        if(store.getters.isLoggedIn) {
            next()
            return
        }
        next('/login')
    } else {
        next()
    }
})

export default router