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
    emitRegister(invoice) {
      this.$emit('registerPaymentRequested', invoice)
    }
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
      <Column field="dni" :header="$t('payments.dni')">
        <template #body>
          {{ student.dni }}
        </template>
      </Column>

      <Column field="name" :header="$t('payments.student')">
        <template #body>
          {{ student.firstName }} {{ student.lastName }}
        </template>
      </Column>

      <Column field="amount" :header="$t('payments.amount')">
        <template #body="slotProps">
          S/ {{ slotProps.data.amount }}
        </template>
      </Column>

      <Column field="status" :header="$t('payments.status')">
        <template #body="slotProps">
          {{ $t('payments.payment-status.' + slotProps.data.status) }}
        </template>
      </Column>

      <Column field="dueDate" :header="$t('payments.due-date')">
        <template #body="slotProps">
          {{ formatDate(slotProps.data.dueDate) }}
        </template>
      </Column>

      <Column :header="$t('payments.action')">
        <template #body="slotProps">
          <Button
              v-if="slotProps.data.status !== 'PAID'"
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