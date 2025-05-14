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
      rowsPerPage: 5
    }
  },
  computed: {
    paginatedExpenses() {
      const start = this.currentPage * this.rowsPerPage
      const end = start + this.rowsPerPage
      return this.expenses.slice(start, end)
    },
    totalAmount() {
      return this.expenses.reduce((sum, tx) => sum + (tx.amount || 0), 0)
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
      return amount.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
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

      <Column :header="$t('finance.table.category')">
        <template #body="slotProps">
          {{slotProps.data.category }}
        </template>
      </Column>

      <Column :header="$t('finance.table.concept')">
        <template #body="slotProps">
          {{ slotProps.data.concept }}
        </template>
      </Column>

      <Column :header="$t('finance.table.amount')" style="text-align: right">
        <template #body="slotProps">
          S/ {{ formatAmount(slotProps.data.amount) }}
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

    <div class="total-row">
      <strong>{{ $t('finance.table.total') }}:</strong>
      S/ {{ formatAmount(totalAmount) }}
    </div>
  </div>
</template>

<style scoped>
.table-container {
  width: 100%;
  overflow-x: auto;
}

.total-row {
  margin-top: 1rem;
  text-align: right;
  font-size: 1rem;
  font-weight: 600;
}
</style>