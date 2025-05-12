import { createRouter, createWebHistory } from 'vue-router'

// Layouts
import MainLayout from "../src/shared/components/main-layout.component.vue";
//import FinanceLayout from '../finance/components/finance-layout.vue'

// Pages
//import LoginPage from '../public/pages/login-page.vue'
//import DashboardPage from '../workspace/pages/dashboard-page.vue'
import Payment from "../src/billing/pages/payment.component.vue";
import Login from "../src/iam-user/pages/login.component.vue" ;
import Organization from "../workspace/pages/organization.component.vue";

//import ExpensesPage from '../finance/pages/expenses-page.vue'
//import ReportsPage from '../finance/pages/reports-page.vue'

const routes = [
    {
        path: '/',
        component: MainLayout,
        children: [
            { path: 'organization', component: Organization },
            { path: 'payments', component: Payment },
            { path: '', redirect: '/workspace' }
        ]
    },
    {
        path: '/login',
        component: Login
    }

]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router