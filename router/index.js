import { createRouter, createWebHistory } from 'vue-router'

// Layouts
import MainLayout from "../src/shared/components/main-layout.component.vue";
//import FinanceLayout from '../finance/components/finance-layout.vue'

// Pages
//import LoginPage from '../public/pages/login-page.vue'
//import DashboardPage from '../workspace/pages/dashboard-page.vue'
import Enrollment from "../src/enrollments/pages/enrollment-management.component.vue";
import Student from "../src/enrollments/pages/student-management.component.vue"
import Payment from "../src/billing/pages/payment.component.vue";
import Organization from "../workspace/pages/organization.component.vue";
import AcademicPeriod from "../src/enrollments/pages/academic-period-management.component.vue";
//import ExpensesPage from '../finance/pages/expenses-page.vue'
//import ReportsPage from '../finance/pages/reports-page.vue'

const routes = [
    {
        path: '/',
        component: MainLayout,
        children: [
            { path: 'organization', component: Organization, children: [
                    {path: 'academic-periods', component: AcademicPeriod}
                ]},
            { path: 'payments', component: Payment },
            { path: 'enrollment', component: Enrollment},
            { path: 'students', component: Student},
            { path: '', redirect: '/organization' },
        ]
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router