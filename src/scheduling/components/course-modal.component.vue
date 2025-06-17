<template>
  <pv-dialog v-model:visible="isVisible" :modal="true" :header="dialogTitle" @hide="onCancel" class="course-dialog">
    <template v-if="mode === 'add' || mode === 'edit'">
      <form @submit.prevent="onSubmit" class="form-row">
        <div class="p-field p-grid">
          <label for="name" class="p-col-12 p-md-2">{{ $t('scheduling.course.modal.form.name') }}</label>
          <div class="p-col-12 p-md-10">
            <pv-input-text v-model="course.name" id="name" required :class="{'p-invalid': nameInputInvalid}" :placeholder="$t('scheduling.course.modal.form.namePlaceholder')" />
            <small v-if="nameInputInvalid" class="p-error">{{ $t('scheduling.course.modal.form.nameRequired') }}</small>
          </div>
        </div>
        <div class="p-field p-grid">
          <label for="code" class="p-col-12 p-md-2">{{ $t('scheduling.course.modal.form.code') }}</label>
          <div class="p-col-12 p-md-10">
            <pv-input-text v-model="course.code" id="code" required :class="{'p-invalid': codeInputInvalid}" :placeholder="$t('scheduling.course.modal.form.codePlaceholder')" />
            <small v-if="codeInputInvalid" class="p-error">{{ $t('scheduling.course.modal.form.codeRequired') }}</small>
          </div>
        </div>
        <div class="p-field p-grid">
          <label for="description" class="p-col-12 p-md-2">{{ $t('scheduling.course.modal.form.description') }}</label>
          <div class="p-col-12 p-md-10">
            <pv-textarea v-model="course.description" id="description" required :class="{'p-invalid': descInputInvalid}" rows="3" :placeholder="$t('scheduling.course.modal.form.descriptionPlaceholder')"></pv-textarea>
            <small v-if="descInputInvalid" class="p-error">{{ $t('scheduling.course.modal.form.descriptionRequired') }}</small>
          </div>
        </div>
      </form>
    </template>
    <template v-if="mode === 'delete'">
      <div class="delete-confirmation">
        <p>{{ $t('scheduling.course.modal.delete.confirm') }} "{{ course.name }}"?</p>
        <p>{{ $t('scheduling.course.modal.delete.warning') }}</p>
      </div>
    </template>
    <template #footer>
      <pv-button :label="$t('scheduling.course.modal.buttons.cancel')" icon="pi pi-times" @click="onCancel" class="p-button-text" />
      <pv-button v-if="mode !== 'delete'" :label="$t('scheduling.course.modal.buttons.save')" icon="pi pi-check" @click="onSubmit" class="p-button-success" />
      <pv-button v-if="mode === 'delete'" :label="$t('scheduling.course.modal.buttons.delete')" icon="pi pi-trash" @click="onConfirmDelete" class="p-button-danger" />
    </template>
  </pv-dialog>
</template>

<script>
import { ref, watch, computed, toRef } from 'vue';
import { useI18n } from 'vue-i18n';

export default {
  name: 'course-modal',
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
    courseData: {
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

    // Create a deep copy of courseData to avoid modifying the prop directly
    const course = ref({...props.courseData});

    // Update course whenever courseData changes
    watch(() => props.courseData, (newVal) => {
      course.value = {...newVal};
    }, { deep: true });

    // Computed property for dynamic dialog title
    const dialogTitle = computed(() => {
      if (props.mode === 'add') return t('scheduling.course.modal.title.add');
      if (props.mode === 'edit') return t('scheduling.course.modal.title.edit');
      if (props.mode === 'delete') return t('scheduling.course.modal.title.delete');
      return '';
    });

    // Form validation states
    const nameInputInvalid = ref(false);
    const codeInputInvalid = ref(false);
    const descInputInvalid = ref(false);

    // Validate the form inputs
    const validateForm = () => {
      nameInputInvalid.value = !course.value.name;
      codeInputInvalid.value = !course.value.code;
      descInputInvalid.value = !course.value.description;
      return !nameInputInvalid.value && !codeInputInvalid.value && !descInputInvalid.value;
    };

    // Form submission handler
    const onSubmit = () => {
      if (validateForm()) {
        emit('submit', {...course.value});
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
      emit('delete', course.value);
      isVisible.value = false;
    };

    return {
      isVisible,
      course,
      dialogTitle,
      nameInputInvalid,
      codeInputInvalid,
      descInputInvalid,
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

textarea {
  resize: vertical;
  min-height: 80px;
}
</style>