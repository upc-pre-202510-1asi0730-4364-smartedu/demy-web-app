<script>
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'

export default {
  name: 'student-search',
  components: {
    InputText,
    Button
  },
  data() {
    return {
      value: ''
    }
  },
  emits: ['search'],
  methods: {
    onSearchClick() {
      console.log('Búsqueda ejecutada desde Enter o botón')
      this.$emit('search', this.value.trim())
    }
  }
}
</script>

<template>
  <div class="student-search">
    <form class="student-search-form" @submit.prevent="onSearchClick">
      <div class="p-inputgroup student-form-field">
        <InputText
            v-model="value"
            :placeholder="$t('payments.dni-input')"
            class="dni-input"
            required
        />
        <Button
            v-if="value"
            icon="pi pi-times"
            severity="secondary"
            @click="value = ''"
            type="button"
        />
      </div>

      <Button
          class="search-button"
          type="submit"
          severity="primary"
          label="$t('payments.search-button')"
      />
    </form>
  </div>
</template>

<style scoped>
.student-search-form {
  display: flex;
  align-items: flex-end;
  gap: 1rem;
}

.student-form-field {
  min-width: 200px;
}

.search-button {
  margin-bottom: 1.7rem;
}

@media (max-width: 600px) {
  .student-form-field {
    min-width: 20%;
  }

  .student-search-form {
    align-items: stretch;
  }

  .search-button {
    margin-top: 0.5rem;
  }
}
</style>