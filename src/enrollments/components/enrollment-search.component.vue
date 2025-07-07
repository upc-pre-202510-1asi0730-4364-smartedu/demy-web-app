<script>
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'

export default {
  name: 'enrollment-search',
  components: {
    InputText,
    Button
  },
  data() {
    return {
      dni: ''
    }
  },
  emits: ['search'],
  methods: {
    onSearchClick() {
      const trimmed = this.dni.trim();
      if (!trimmed) return;
      this.dni = trimmed;
      this.$emit('search', trimmed);
    }
  }
}
</script>

<template>
  <div class="enrollment-search">
    <form class="enrollment-search-form" @submit.prevent="onSearchClick">
      <div class="p-inputgroup enrollment-form-field">
        <InputText
            v-model="dni"
            :placeholder="$t('enrollment.search.input')"
            class="dni-input"
            :maxlength="8"
            pattern="[0-9]{8}"
            aria-label="DNI"
            required
        />
        <Button
            v-if="dni"
            icon="pi pi-times"
            severity="secondary"
            @click="dni = ''"
            type="button"
        />
      </div>

      <Button
          class="search-button"
          type="submit"
          severity="primary"
          :label="$t('enrollment.search.button')"
      />
    </form>
  </div>
</template>

<style scoped>
.enrollment-search-form {
  display: flex;
  align-items: flex-end;
  gap: 1rem;
  margin-bottom: 1rem;
}

.enrollment-form-field {
  min-width: 200px;
}

@media (max-width: 600px) {
  .enrollment-search-form {
    flex-wrap: nowrap;
    align-items: center;
  }

  .enrollment-form-field {
    flex: 1;
    min-width: 0;
  }

  .dni-input {
    width: 75%;
  }

  .search-button {
    flex-shrink: 0;
    white-space: nowrap;
    font-size: 0.9rem;
  }
}
</style>
