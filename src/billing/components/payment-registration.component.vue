<script>
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Calendar from 'primevue/calendar'
import Dropdown from 'primevue/dropdown'

export default {
  name: 'payment-registration',
  components: {
    InputText,
    Button,
    Calendar,
    Dropdown
  },
  props: {
    student: {
      type: Object,
      required: true
    },
    invoice: {
      type: Object,
      required: true
    }
  },
  emits: ['paymentRegistered'],
  data() {
    return {
      paidAt: new Date(),
      methods: ['CASH', 'CARD', 'TRANSFER', 'WALLET', 'OTHER'],
      selectedMethod: 'CASH'
    }
  },
  computed: {
    formattedAmount() {
      if (typeof this.invoice.amount !== 'number') return ''
      const currencyCode = this.invoice.currency || 'PEN'
      return new Intl.NumberFormat('es-PE', {
        style: 'currency',
        currency: currencyCode
      }).format(this.invoice.amount)
    }
  },
  methods: {
    onSubmit() {
      if (!this.paidAt) {
        console.warn('Formulario inválido: falta fecha')
        return
      }
      if (!this.selectedMethod) {
        console.warn('Formulario inválido: falta método de pago')
        return
      }

      this.$emit('paymentRegistered', {
        amount: this.invoice.amount,
        paidAt: this.paidAt,
        method: this.selectedMethod
      })

      // Resetear el formulario
      this.paidAt = new Date()
      this.selectedMethod = 'CASH'
    }
  }
}
</script>

<template>
  <div class="payment-registration">
    <h3>{{ $t('payments.register-title') }}</h3>

    <form @submit.prevent="onSubmit" class="form-section">
      <div class="form-field">
        <label>{{ $t('payments.first-name') }}</label>
        <InputText :modelValue="student.firstName" disabled />
      </div>

      <div class="form-field">
        <label>{{ $t('payments.last-name') }}</label>
        <InputText :modelValue="student.lastName" disabled />
      </div>

      <div class="form-field">
        <label>DNI</label>
        <InputText :modelValue="student.dni" disabled />
      </div>

      <div class="form-field">
        <label>{{ $t('payments.amount') }}</label>
        <InputText :modelValue="formattedAmount" disabled />
      </div>

      <div class="form-field">
        <label>{{ $t('payments.method') }}</label>
        <Dropdown
            v-model="selectedMethod"
            :options="methods"
            placeholder="Seleccione método"
            required
        >
          <template #option="slotProps">
            {{ $t('payments.methods.' + slotProps.option) }}
          </template>
          <template #value="slotProps">
            {{ $t('payments.methods.' + slotProps.value) }}
          </template>
        </Dropdown>
      </div>

      <div class="form-field">
        <label>{{ $t('payments.paid-at') }}</label>
        <Calendar
            v-model="paidAt"
            :showIcon="true"
            dateFormat="dd/mm/yy"
            required
        />
      </div>

      <div class="actions">
        <Button
            type="submit"
            :label="$t('payments.register-button')"
            severity="primary"
        />
      </div>
    </form>
  </div>
</template>

<style scoped>
.payment-registration {
  max-width: 800px;
  margin: 0 auto;
}

.form-section {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1.5rem;
}

.form-field {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.actions {
  grid-column: 1 / -1;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 0.5rem;
}

@media (max-width: 600px) {
  .form-section {
    grid-template-columns: 1fr;
  }

  .actions {
    justify-content: center;
  }
}
</style>