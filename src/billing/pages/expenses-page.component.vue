<script>
import ExpenseForm from '../components/expense-form.component.vue'
import ExpenseTable from '../components/expense-table.component.vue'

import { FinancialTransactionService } from '../services/financial-transaction.service.js'

export default {
  name: 'expense-page',
  components: {
    ExpenseForm,
    ExpenseTable
  },
  data() {
    const now = new Date()
    return {
      allTransactions: [],
      expenses: [],
      selectedMonth: now.getMonth(),
      selectedYear: now.getFullYear(),
      selectedDate: new Date(now.getFullYear(), now.getMonth(), 1),
      transactionService: new FinancialTransactionService()
    }
  },
  created() {
    this.loadAllTransactions()
  },
  methods: {
    async loadAllTransactions() {
      try {
        const transactions = await this.transactionService.getAll()
        this.allTransactions = transactions
        this.applyDateFilter()
      } catch (err) {
        console.error('Error al cargar transacciones', err)
      }
    },
    applyDateFilter() {
      this.expenses = this.allTransactions.filter(tx => {
        const txDate = new Date(tx.date)
        return (
            tx.type === 'EXPENSE' &&
            txDate.getMonth() === this.selectedMonth &&
            txDate.getFullYear() === this.selectedYear
        )
      })
    },
    setMonthAndYear(date) {
      this.selectedMonth = date.getMonth()
      this.selectedYear = date.getFullYear()
      this.selectedDate = new Date(this.selectedYear, this.selectedMonth, 1)
      this.applyDateFilter()
    },
    async handleRegister(expenseData) {
      const payload = {
        category: expenseData.category,
        concept: expenseData.concept,
        method: expenseData.method,
        currency: expenseData.currency,
        amount: expenseData.amount,
        paidAt: expenseData.date
      }

      try {
        await this.transactionService.registerExpense(payload)
        await this.loadAllTransactions()
      } catch (err) {
        console.error('Error al registrar gasto', err)
      }
    }
  }
}
</script>

<template>
  <div>
    <h2>{{ $t('finance.title') }}</h2>
    <h3>{{ $t('finance.subtitle.register') }}</h3>

    <expense-form @confirm="handleRegister" />

    <hr class="divider" />

    <h3>{{ $t('finance.subtitle.summary') }}</h3>

    <expense-table v-if="expenses.length > 0" :expenses="expenses" />
    <p v-else>{{ $t('finance.summary.empty') }}</p>
  </div>
</template>

<style scoped>
.divider {
  margin: 2rem 0;
}
</style>