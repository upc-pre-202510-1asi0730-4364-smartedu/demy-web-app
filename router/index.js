import { createRouter, createWebHistory } from 'vue-router'

// Layouts
import MainLayout from "../src/shared/components/main-layout.component.vue";
//import FinanceLayout from '../finance/components/finance-layout.vue'

// Pages
//import LoginPage from '../public/pages/login-page.vue'
//import DashboardPage from '../workspace/pages/dashboard-page.vue'
import Payment from "../src/billing/pages/payment.component.vue";
import Organization from "../workspace/pages/organization.component.vue";
import Courses from "../src/scheduling/pages/courses-overview.component.vue";
//import ExpensesPage from '../finance/pages/expenses-page.vue'
//import ReportsPage from '../finance/pages/reports-page.vue'
import Classrooms from "../src/scheduling/pages/classrooms-overview.component.vue";
import WeeklySchedules from "../src/scheduling/pages/weekly-schedules-overview.component.vue";

const routes = [
    {
        path: '/',
        component: MainLayout,
        children: [
            { path: 'organization', component: Organization },
            { path: 'organization/courses', component: Courses },
            { path: 'organization/classrooms', component: Classrooms },
            { path: 'organization/weekly-schedules', component: WeeklySchedules },
            { path: 'payments', component: Payment },
            { path: '', redirect: '/workspace' }
        ]
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router