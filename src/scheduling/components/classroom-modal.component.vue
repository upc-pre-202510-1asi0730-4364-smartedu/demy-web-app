<template>
  <pv-dialog v-model:visible="isVisible" :modal="true" :header="dialogTitle" @hide="onCancel" class="classroom-dialog">
    <template v-if="mode === 'add' || mode === 'edit'">
      <form @submit.prevent="onSubmit" class="form-row">
        <!-- Field for Code -->
        <div class="p-field p-grid">
          <label for="code" class="p-col-12 p-md-2">{{ $t('scheduling.classroom.modal.form.code') }}</label>
          <div class="p-col-12 p-md-10">
            <pv-input-text v-model="classroom.code" id="code" required :class="{'p-invalid': codeInputInvalid}" :placeholder="$t('scheduling.classroom.modal.form.codePlaceholder')" />
            <small v-if="codeInputInvalid" class="p-error">{{ $t('scheduling.classroom.modal.form.codeRequired') }}</small>
          </div>
        </div>
        <!-- Field for Capacity -->
        <div class="p-field p-grid">
          <label for="capacity" class="p-col-12 p-md-2">{{ $t('scheduling.classroom.modal.form.capacity') }}</label>
          <div class="p-col-12 p-md-10">
            <pv-input-text v-model="classroom.capacity" id="capacity" required :class="{'p-invalid': capacityInputInvalid}" :placeholder="$t('scheduling.classroom.modal.form.capacityPlaceholder')" />
            <small v-if="capacityInputInvalid" class="p-error">{{ $t('scheduling.classroom.modal.form.capacityRequired') }}</small>
          </div>
        </div>
        <!-- Field for Campus -->
        <div class="p-field p-grid">
          <label for="campus" class="p-col-12 p-md-2">{{ $t('scheduling.classroom.modal.form.campus') }}</label>
          <div class="p-col-12 p-md-10">
            <pv-input-text v-model="classroom.campus" id="campus" required :class="{'p-invalid': campusInputInvalid}" :placeholder="$t('scheduling.classroom.modal.form.campusPlaceholder')" />
            <small v-if="campusInputInvalid" class="p-error">{{ $t('scheduling.classroom.modal.form.campusRequired') }}</small>
          </div>
        </div>
      </form>
    </template>
    <template v-if="mode === 'delete'">
      <div class="delete-confirmation">
        <p>{{ $t('scheduling.classroom.modal.delete.confirm') }}: "{{ classroom.code }}"?</p>
        <p>{{ $t('scheduling.classroom.modal.delete.warning') }}</p>
      </div>
    </template>
    <template #footer>
      <pv-button :label="$t('scheduling.classroom.modal.buttons.cancel')" icon="pi pi-times" @click="onCancel" class="p-button-text" />
      <pv-button v-if="mode !== 'delete'" :label="$t('scheduling.classroom.modal.buttons.save')" icon="pi pi-check" @click="onSubmit" class="p-button-success" />
      <pv-button v-if="mode === 'delete'" :label="$t('scheduling.classroom.modal.buttons.delete')" icon="pi pi-trash" @click="onConfirmDelete" class="p-button-danger" />
    </template>
  </pv-dialog>
</template>

<script>
import { ref, watch, computed, toRef } from 'vue';
import { useI18n } from 'vue-i18n';

export default {
  name: 'classroom-modal',
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    mode: {
      type: String,
      required: true,
      validator: (value) => ['add', 'edit', 'delete'].includes(value)
    },
    classroomData: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ['update:visible', 'submit', 'cancel', 'delete'],
  setup(props, { emit }) {
    const { t } = useI18n();
    // Use toRef to create a reactive reference to props.visible
    const visible = toRef(props, 'visible');

    // Create a computed property for isVisible with getter and setter
    const isVisible = computed({
      get: () => visible.value,
      set: (value) => emit('update:visible', value)
    });

    // Create a deep copy of classroomData to avoid modifying the prop directly
    const classroom = ref({
      code: props.classroomData.code || '',
      capacity: props.classroomData.capacity || 0,  // Initialize capacity with 0 if it's not provided
      campus: props.classroomData.campus || ''
    });

    // Watch for changes in classroomData to update classroom ref
    watch(() => props.classroomData, (newVal) => {
      classroom.value = { ...newVal };
    }, { deep: true });

    // Computed property for dynamic dialog title
    const dialogTitle = computed(() => {
      if (props.mode === 'add') return t('scheduling.classroom.modal.title.add');
      if (props.mode === 'edit') return t('scheduling.classroom.modal.title.edit');
      if (props.mode === 'delete') return t('scheduling.classroom.modal.title.delete');
      return '';
    });

    // Form validation states
    const codeInputInvalid = ref(false);
    const capacityInputInvalid = ref(false);
    const campusInputInvalid = ref(false);

    // Validate the form inputs
    const validateForm = () => {
      codeInputInvalid.value = !classroom.value.code;
      capacityInputInvalid.value = !(classroom.value.capacity > 0);  // Ensure capacity is a positive number
      campusInputInvalid.value = !classroom.value.campus;
      return !codeInputInvalid.value && !capacityInputInvalid.value && !campusInputInvalid.value;
    };

    // Form submission handler
    const onSubmit = () => {
      console.log('Form submitted:', classroom.value);  // Debugging: log the classroom object
      if (validateForm()) {
        emit('submit', { ...classroom.value });
        isVisible.value = false;
      }
    };

    // Cancel handler
    const onCancel = () => {
      isVisible.value = false;
      emit('cancel');
    };

    // Delete confirmation handler
    const onConfirmDelete = () => {
      emit('delete', classroom.value);
      isVisible.value = false;
    };

    return {
      isVisible,
      classroom,
      dialogTitle,
      codeInputInvalid,
      capacityInputInvalid,
      campusInputInvalid,
      onSubmit,
      onCancel,
      onConfirmDelete
    };
  }
};
</script>

<style scoped>
.form-row {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.p-field {
  margin-bottom: 15px;
}

.delete-confirmation {
  text-align: center;
  padding: 10px;
}


.p-invalid {
  border-color: #f44336;
}

.p-error {
  color: #f44336;
  font-size: 0.75rem;
  margin-top: 4px;
  display: block;
}

.p-button-success {
  background-color: var(--color-success);
  color: white;
}

.p-button-danger {
  background-color: var(--color-error);
  color: white;
}
</style>
