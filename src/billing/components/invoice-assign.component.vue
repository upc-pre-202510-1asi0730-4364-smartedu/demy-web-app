<script>
import InputText from 'primevue/inputtext'
import Calendar from 'primevue/calendar'
import Dropdown from 'primevue/dropdown'
import Button from 'primevue/button'
import { InvoiceService } from '../services/invoice.service.js'
import { NotificationService } from "../../shared/services/notification.service.js";

export default {
  name: 'invoice-assign',
  components: {
    InputText,
    Calendar,
    Dropdown,
    Button
  },
  data() {
    return {
      dni: '',
      amount: 0,
      currency: 'PEN',
      dueDate: new Date(),
      currencies: ['PEN', 'USD'],
      invoiceService: new InvoiceService()
    }
  },
  methods: {
    async onSubmit() {
      if (!this.dni.trim()) {
        this.notification.showError(this.$t('common.required-dni'))
        return
      }

      const payload = {
        amount: this.amount,
        currency: this.currency,
        dueDate: this.dueDate.toISOString().split('T')[0]
      }

      try {
        await this.invoiceService.create(this.dni.trim(), payload)
        this.notification.showSuccess(this.$t('payments.assign.success'))

        this.dni = ''
        this.amount = 0
        this.currency = 'PEN'
        this.dueDate = new Date()
      } catch (error) {
        this.notification.showError(this.$t('payments.assign.error'))
      }
    }
  }
}
</script>

<template>
  <div>
    <h3>{{ $t('payments.assign-title') }}</h3>

    <form @submit.prevent="onSubmit" class="assign-form">
      <!-- DNI -->
      <div class="form-field">
        <label for="dni">{{ $t('payments.dni-label') }}</label>
        <InputText id="dni" v-model="dni" required />
      </div>

      <!-- Amount -->
      <div class="form-field">
        <label for="amount">{{ $t('payments.amount-label') }}</label>
        <InputText
            id="amount"
            v-model.number="amount"
            type="number"
            required
        />
      </div>

      <!-- Currency -->
      <div class="form-field">
        <label for="currency">{{ $t('payments.currency-label') }}</label>
        <Dropdown
            id="currency"
            v-model="currency"
            :options="currencies"
            optionLabel=""
            placeholder="Seleccione"
            required
        />
      </div>

      <!-- Due Date -->
      <div class="form-field">
        <label for="dueDate">{{ $t('payments.due-date-label') }}</label>
        <Calendar
            id="dueDate"
            v-model="dueDate"
            dateFormat="yy-mm-dd"
            :showIcon="true"
            required
        />
      </div>

      <!-- Submit Button -->
      <div class="actions">
        <Button
            type="submit"
            :label="$t('payments.create-button')"
            severity="primary"
        />
      </div>
    </form>
  </div>
</template>

<style scoped>
.assign-form {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  box-sizing: border-box;
  background-color: #fafafa;
  border-radius: 8px;
}

h3 {
  text-align: center;
  margin-top: 16px;
  margin-bottom: 12px;
  font-size: 1.5em;
  color: #333;
}

.form-field {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.actions {
  grid-column: 1 / -1;
  display: flex;
  justify-content: center;
  margin-top: 12px;
}

p {
  text-align: center;
  margin-top: 16px;
  color: #d32f2f;
  font-weight: 500;
}

@media (max-width: 600px) {
  .assign-form {
    grid-template-columns: 1fr;
    padding: 16px;
    gap: 16px;
  }

  h3 {
    font-size: 1.3em;
  }

  .form-field {
    max-width: 100%;
  }
}
</style>