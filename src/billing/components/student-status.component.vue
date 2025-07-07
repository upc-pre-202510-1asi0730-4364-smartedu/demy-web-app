<script>
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'

export default {
  name: 'student-status',
  components: {
    DataTable,
    Column,
    Button
  },
  props: {
    student: {
      type: Object,
      required: true
    },
    invoices: {
      type: Array,
      required: true
    }
  },
  emits: ['registerPaymentRequested'],
  methods: {
    formatDate(date) {
      if (!date) return ''
      const d = new Date(date)
      return new Intl.DateTimeFormat('es-PE').format(d)
    },
    formatCurrency(amount, currencyCode = 'PEN') {
      if (typeof amount !== 'number') return amount
      return new Intl.NumberFormat('es-PE', {
        style: 'currency',
        currency: currencyCode
      }).format(amount)
    },
    emitRegister(invoice) {
      this.$emit('registerPaymentRequested', invoice)
    }
  },
  mounted() {
    console.log('Student prop:', this.student)
  }

}
</script>

<template>
  <div class="table-container">
    <DataTable
        :value="invoices"
        :scrollable="true"
        class="p-datatable-gridlines"
    >
      <Column :header="$t('payments.dni')">
        <template #body="slotProps">
          {{ slotProps.data.dni }}
        </template>
      </Column>

      <Column :header="$t('payments.student')">
        <template #body="slotProps">
          {{ slotProps.data.name }}
        </template>
      </Column>

      <Column :header="$t('payments.amount')">
        <template #body="slotProps">
          {{ formatCurrency(slotProps.data.amount, slotProps.data.currency?.code) }}
        </template>
      </Column>

      <Column :header="$t('payments.status')">
        <template #body="slotProps">
          {{ $t('payments.payment-status.' + slotProps.data.status) }}
        </template>
      </Column>

      <Column :header="$t('payments.due-date')">
        <template #body="slotProps">
          {{ formatDate(slotProps.data.dueDate) }}
        </template>
      </Column>

      <Column :header="$t('payments.action')">
        <template #body="slotProps">
          <Button
              v-if="slotProps.data.status !== 'Paid'"
              :label="$t('payments.register-action')"
              severity="primary"
              @click="emitRegister(slotProps.data)"
          />
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<style scoped>
.table-container {
  width: 100%;
  overflow-x: auto;
}

.table-container::-webkit-scrollbar {
  height: 6px;
}

.table-container::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}
</style>