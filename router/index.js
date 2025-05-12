import { createRouter, createWebHistory } from 'vue-router'

// Layouts
import MainLayout from "../src/shared/components/main-layout.component.vue";
//import FinanceLayout from '../finance/components/finance-layout.vue'

// Pages
//import LoginPage from '../public/pages/login-page.vue'
//import DashboardPage from '../workspace/pages/dashboard-page.vue'
//import PaymentsPage from '../billing/pages/payments-page.vue'
//import OrganizationPage from '../workspace/pages/organization-page.vue'
//import ExpensesPage from '../finance/pages/expenses-page.vue'
//import ReportsPage from '../finance/pages/reports-page.vue'

const routes = [
    {
        path: '/',
        component: MainLayout,
        children: [
            { path: 'organization', component: OrganizationPage },
            { path: 'workspace', component: DashboardPage },
            { path: 'payments', component: PaymentsPage },
            {
                path: 'finance',
                component: FinanceLayout,
                children: [
                    { path: '', redirect: 'expenses' },
                    { path: 'expenses', component: ExpensesPage },
                    { path: 'reports', component: ReportsPage }
                ]
            },
            { path: '', redirect: '/workspace' }
        ]
    },
    {
        path: '/login',
        component: LoginPage
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router