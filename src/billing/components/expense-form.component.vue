<script>
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Calendar from 'primevue/calendar'
import Dropdown from 'primevue/dropdown'
import Button from 'primevue/button'

export default {
  name: 'expense-form',
  components: {
    InputText,
    InputNumber,
    Calendar,
    Dropdown,
    Button
  },
  props: {
    // Si necesitas recibir props, las defines aquí
  },
  data() {
    return {
      form: {
        concept: '',
        amount: 0,
        date: new Date(),
        category: ''
      },
      categories: [
        { label: 'Servicios', value: 'SERVICES' },
        { label: 'Mantenimiento', value: 'MAINTENANCE' },
        { label: 'Compras', value: 'PURCHASES' },
        { label: 'Otros', value: 'OTHERS' }
      ]
    }
  },
  emits: ['expenseSubmitted'],
  methods: {
    onSubmit() {
      if (!this.form.concept || !this.form.amount || !this.form.category) {
        console.warn('Formulario inválido')
        return
      }

      this.$emit('expenseSubmitted', { ...this.form })

      // Reset
      this.form = {
        concept: '',
        amount: 0,
        date: new Date(),
        category: ''
      }
    }
  }
}
</script>

<template>
  <form @submit.prevent="onSubmit" class="form-grid">
    <div class="form-field">
      <label for="concept">Concepto</label>
      <InputText id="concept" v-model="form.concept" required />
    </div>

    <div class="form-field">
      <label for="amount">Monto</label>
      <InputNumber
          id="amount"
          v-model="form.amount"
          mode="currency"
          currency="PEN"
          locale="es-PE"
          required
      />
    </div>

    <div class="form-field">
      <label for="category">Categoría</label>
      <Dropdown
          id="category"
          v-model="form.category"
          :options="categories"
          optionLabel="label"
          optionValue="value"
          placeholder="Seleccione una categoría"
          required
      />
    </div>

    <div class="form-field">
      <label for="date">Fecha</label>
      <Calendar
          id="date"
          v-model="form.date"
          showIcon
          dateFormat="dd/mm/yy"
          required
      />
    </div>

    <div class="form-actions">
      <Button type="submit" label="Registrar gasto" severity="primary" />
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
</style>