<script>
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Paginator from 'primevue/paginator'

export default {
  name: 'expense-table',
  components: {
    DataTable,
    Column,
    Paginator
  },
  props: {
    expenses: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      currentPage: 0,
      rowsPerPage: 5,
      totalIncomePEN: 0,
      totalIncomeUSD: 0,
      totalExpensePEN: 0,
      totalExpenseUSD: 0
    }
  },
  computed: {
    paginatedExpenses() {
      const start = this.currentPage * this.rowsPerPage
      const end = start + this.rowsPerPage
      return this.expenses.slice(start, end)
    }
  },
  watch: {
    expenses: {
      immediate: true,
      handler(newExpenses) {
        this.calculateTotals(newExpenses)
      }
    }
  },
  methods: {
    onPageChange(event) {
      this.currentPage = event.page
      this.rowsPerPage = event.rows
    },
    formatDate(date) {
      if (!date) return ''
      return new Intl.DateTimeFormat('es-PE').format(new Date(date))
    },
    formatAmount(amount) {
      if (!amount) return '0.00'
      return amount.toLocaleString('es-PE', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
    },
    calculateTotals(data) {
      let incomePEN = 0
      let incomeUSD = 0
      let expensePEN = 0
      let expenseUSD = 0

      data.forEach(tx => {
        const amount = tx.payment?.amount ?? 0
        const currency = tx.payment?.currency ?? 'PEN'

        if (tx.type === 'INCOME') {
          if (currency === 'USD') incomeUSD += amount
          else incomePEN += amount
        }

        if (tx.type === 'EXPENSE') {
          if (currency === 'USD') expenseUSD += amount
          else expensePEN += amount
        }
      })

      this.totalIncomePEN = incomePEN
      this.totalIncomeUSD = incomeUSD
      this.totalExpensePEN = expensePEN
      this.totalExpenseUSD = expenseUSD
    },
    getTranslatedConcept(tx) {
      if (tx.concept === 'Paid student invoice' && tx.category === 'STUDENTS') {
        return this.$t('finance.concept.paidStudentInvoice')
      }
      return tx.concept
    }
  }
}
</script>

<template>
  <div class="table-container">
    <DataTable :value="paginatedExpenses" class="p-datatable-gridlines" responsiveLayout="scroll">
      <Column :header="$t('finance.table.date')">
        <template #body="slotProps">
          {{ formatDate(slotProps.data.date) }}
        </template>
      </Column>

      <Column :header="$t('finance.table.type')">
        <template #body="slotProps">
          {{ $t('finance.type.' + (slotProps.data.type?.toLowerCase() || '')) }}
        </template>
      </Column>

      <Column :header="$t('finance.table.category')">
        <template #body="slotProps">
          {{ $t('finance.category.' + (slotProps.data.category?.toLowerCase() || '')) }}
        </template>
      </Column>

      <Column :header="$t('finance.table.concept')">
        <template #body="slotProps">
          {{ getTranslatedConcept(slotProps.data) }}
        </template>
      </Column>

      <Column :header="$t('finance.table.amount')" style="text-align: right">
        <template #body="slotProps">
          {{ slotProps.data.payment?.currency || '' }} {{ formatAmount(slotProps.data.payment?.amount || 0) }}
        </template>
      </Column>

      <Column :header="$t('finance.table.paymentMethod')">
        <template #body="slotProps">
          {{ $t('finance.method.' + (slotProps.data.payment?.method?.toLowerCase() || '')) }}
        </template>
      </Column>
    </DataTable>

    <Paginator
        :rows="rowsPerPage"
        :totalRecords="expenses.length"
        :rowsPerPageOptions="[5, 10, 20]"
        :page="currentPage"
        @page="onPageChange"
        template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
        class="custom-paginator"
    />

    <div class="totals-container">
      <div class="total-item income">
        <strong>{{ $t('finance.table.totalIncome') }}</strong>
        <div class="totals-by-currency">
          <div>S/ {{ formatAmount(totalIncomePEN) }}</div>
          <div>USD {{ formatAmount(totalIncomeUSD) }}</div>
        </div>
      </div>

      <div class="total-item expense">
        <strong>{{ $t('finance.table.totalExpense') }}</strong>
        <div class="totals-by-currency">
          <div>S/ {{ formatAmount(totalExpensePEN) }}</div>
          <div>USD {{ formatAmount(totalExpenseUSD) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.table-container {
  width: 100%;
  overflow-x: auto;
}

.totals-container {
  margin-top: 1rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 1rem;
  background-color: #f5f5f5;
  padding: 0.75rem 1rem;
  border-radius: 8px;
}

.totals-by-currency {
  display: flex;
  flex-direction: column;
  margin-top: 0.25rem;
  gap: 0.25rem;
  font-size: 0.95rem;
}

.total-item {
  flex: 1 1 45%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  padding: 0.5rem;
  border-radius: 6px;
  background-color: #ffffff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.total-item.income {
  color: #38C976;
}

.total-item.expense {
  color: lightcoral;
}

@media (max-width: 480px) {
  .total-item {
    flex: 1 1 100%;
  }
}
</style>