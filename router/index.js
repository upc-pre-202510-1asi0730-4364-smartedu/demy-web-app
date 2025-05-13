import { createRouter, createWebHistory } from 'vue-router'

// Layouts
import MainLayout from "../src/shared/components/main-layout.component.vue";
//import FinanceLayout from '../finance/components/finance-layout.vue'

// Pages
//import LoginPage from '../public/pages/login-page.vue'
//import DashboardPage from '../workspace/pages/dashboard-page.vue'
import Payment from "../src/billing/pages/payment.component.vue";
import Login from "../src/iam-user/pages/login.component.vue" ;
import SignUp from "../src/iam-user/pages/sign-up.component.vue";
import Organization from "../workspace/pages/organization.component.vue";
import TeacherPage from "../src/iam-user/pages/teacher.component.vue";
import PlantSelect from "../src/iam-user/pages/plan-select.component.vue";
//import ExpensesPage from '../finance/pages/expenses-page.vue'
//import ReportsPage from '../finance/pages/reports-page.vue'

const routes = [
    {
        path: '/',
        component: MainLayout,
        children: [
            {
                path: 'organization',
                children: [
                    {path: '', name: 'organization', component: Organization},
                    {path: 'teachers', component: TeacherPage},
                ]

            },
            { path: 'payments', component: Payment },
            { path: '', redirect: '/workspace' }
        ]
    },
    {
        path: '/login',
        component: Login
    },
    {
        path: '/signup',
        component: SignUp
    },
    {
        path: '/plantSelect',
        component: PlantSelect
    }


]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router