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
import ExpensesPage from "../src/billing/pages/expenses-page.component.vue";
import TeacherPage from "../src/iam-user/pages/teacher.component.vue";
import PlantSelect from "../src/iam-user/pages/plan-select.component.vue";
import RecoverPassword from "../src/iam-user/pages/recover-password.component.vue";
import ResetPassword from "../src/iam-user/pages/reset-password.component.vue";

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
            { path: 'finance', component: ExpensesPage },
            { path: '', redirect: '/organization' }
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
    },
    {
        path: '/forgot-password',
        component: RecoverPassword
    },
    {
        path: '/reset-password',
        component: ResetPassword
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router