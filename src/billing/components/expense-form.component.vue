<script>
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Calendar from 'primevue/calendar'
import Dropdown from 'primevue/dropdown'
import Button from 'primevue/button'
import { NotificationService } from "../../shared/services/notification.service.js";

export default {
  name: 'expense-form',
  components: {
    InputText,
    InputNumber,
    Calendar,
    Dropdown,
    Button
  },
  emits: ['confirm'],
  data() {
    return {
      notification: new NotificationService(),
      form: {
        amount: null,
        category: '',
        concept: '',
        date: new Date(),
        method: '',
        currency: 'PEN'
      },
      categories: [
        { value: 'PERSONAL', labelKey: 'finance.category.personals' },
        { value: 'MATERIALS', labelKey: 'finance.category.materials' },
        { value: 'SERVICES', labelKey: 'finance.category.services' },
        { value: 'TAXES', labelKey: 'finance.category.taxes' },
        { value: 'MAINTENANCE', labelKey: 'finance.category.maintenance' },
        { value: 'TECHNOLOGY', labelKey: 'finance.category.technology' },
        { value: 'OTHER', labelKey: 'finance.category.others' }
      ],
      methods: [
        { value: 'CASH', labelKey: 'finance.method.cash' },
        { value: 'CARD', labelKey: 'finance.method.card' },
        { value: 'TRANSFER', labelKey: 'finance.method.transfer' },
        { value: 'WALLET', labelKey: 'finance.method.wallet' },
        { value: 'OTHER', labelKey: 'finance.method.others' }
      ],
      currencies: [
        { value: 'PEN', labelKey: 'finance.currency.pen' },
        { value: 'USD', labelKey: 'finance.currency.usd' }
      ]
    }
  },
  methods: {
    onSubmit() {
      if (
          !this.form.amount || this.form.amount <= 0 ||
          !this.form.category || !this.form.concept ||
          !this.form.date || !this.form.method || !this.form.currency
      ) {
        this.notification.showError(this.$t('financial-transactions.form.invalid'))
        return
      }

      this.$emit('confirm', { ...this.form })

      this.notification.showSuccess(this.$t('financial-transactions.form.success'))

      this.resetForm()
    },
    resetForm() {
      this.form = {
        amount: null,
        category: '',
        concept: '',
        date: new Date(),
        method: '',
        currency: 'PEN'
      }
    }
  }
}
</script>

<template>
  <form @submit.prevent="onSubmit" class="expense-form">
    <div class="form-grid">
      <!-- CATEGORÍA -->
      <div class="form-field">
        <label for="category">{{ $t('finance.fields.category') }}</label>
        <Dropdown
            id="category"
            v-model="form.category"
            :options="categories"
            optionLabel="labelKey"
            optionValue="value"
            :placeholder="$t('finance.fields.category')"
            required
        />
      </div>

      <!-- MONTO -->
      <div class="form-field">
        <label for="amount">{{ $t('finance.fields.amount') }}</label>
        <InputNumber
            id="amount"
            v-model="form.amount"
            :min="0.01"
            :useGrouping="true"
            mode="currency"
            :currency="form.currency"
            locale="es-PE"
            required
        />
      </div>

      <!-- CONCEPTO -->
      <div class="form-field">
        <label for="concept">{{ $t('finance.fields.concept') }}</label>
        <InputText
            id="concept"
            v-model="form.concept"
            required
        />
      </div>

      <!-- FECHA -->
      <div class="form-field">
        <label for="date">{{ $t('finance.fields.date') }}</label>
        <Calendar
            id="date"
            v-model="form.date"
            showIcon
            dateFormat="dd/mm/yy"
            required
        />
      </div>

      <!-- MÉTODO -->
      <div class="form-field">
        <label for="method">{{ $t('finance.fields.method') }}</label>
        <Dropdown
            id="method"
            v-model="form.method"
            :options="methods"
            optionLabel="labelKey"
            optionValue="value"
            :placeholder="$t('finance.fields.method')"
            required
        />
      </div>

      <!-- MONEDA -->
      <div class="form-field">
        <label for="currency">{{ $t('finance.fields.currency') }}</label>
        <Dropdown
            id="currency"
            v-model="form.currency"
            :options="currencies"
            optionLabel="labelKey"
            optionValue="value"
            :placeholder="$t('finance.fields.currency')"
            required
        />
      </div>
    </div>

    <div class="submit-button">
      <Button
          type="submit"
          :label="$t('finance.actions.confirm')"
          severity="primary"
      />
    </div>
  </form>
</template>

<style scoped>
.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.25rem;
  align-items: end;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-actions {
  grid-column: 1 / -1;
  display: flex;
  justify-content: flex-end;
}

.submit-button {
  margin-top: 1.5rem;
}

</style>