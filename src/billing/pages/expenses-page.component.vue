<script>
import ExpenseForm from '../components/expense-form.component.vue'
import ExpenseTable from '../components/expense-table.component.vue'

import { FinancialTransactionService } from '../services/financial-transaction.service.js'
import { PartyType, FinancialTransaction } from '../model/financial-transaction.entity.js'

export default {
  name: 'expense-page',
  components: {
    ExpenseForm,
    ExpenseTable
  },
  data() {
    return {
      expenses: [],
      transactionService: new FinancialTransactionService()
    }
  },
  created() {
    this.loadCurrentMonthExpenses()
  },
  methods: {
    async loadCurrentMonthExpenses() {
      try {
        const transactions = await this.transactionService.getAll()
        const currentDate = new Date()
        const currentMonth = currentDate.getMonth()
        const currentYear = currentDate.getFullYear()

        this.expenses = transactions.filter(tx =>
            tx.type === 'EXPENSE' &&
            new Date(tx.date).getMonth() === currentMonth &&
            new Date(tx.date).getFullYear() === currentYear
        )
      } catch (err) {
        console.error('Error al cargar gastos', err)
      }
    },
    async handleRegister(expenseData) {
      const transaction = new FinancialTransaction({
        id: '',
        type: 'EXPENSE',
        source: PartyType.ACADEMY,
        target: PartyType.EXTERNAL,
        category: expenseData.category,
        concept: expenseData.concept,
        date: expenseData.date,
        reference: `TX-${Date.now()}`,
        method: 'CASH',
        amount: expenseData.amount
      })

      try {
        await this.transactionService.create(transaction)
        await this.loadCurrentMonthExpenses()
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

    <expense-form @expenseSubmitted="handleRegister" />

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