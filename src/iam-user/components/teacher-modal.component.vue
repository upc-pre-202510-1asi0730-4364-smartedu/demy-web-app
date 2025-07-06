<script>
export default {
  props: {
    /**
     * Controls the visibility of the modal.
     * @type {boolean}
     */
    visible: Boolean,

    /**
     * Mode in which the modal operates: 'add', 'edit', or 'delete'.
     * @type {'add' | 'edit' | 'delete'}
     */
    mode: {
      type: String,
      validator: value => ['add', 'edit', 'delete'].includes(value)
    },

    /**
     * Initial data for the teacher being created or edited.
     * @type {Object}
     */
    teacherData: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      /**
       * Form data for the teacher being managed.
       */
      teacher: {
        fullName: '',
        email: '',
        passwordHash: '',
        role: 'TEACHER',
        status: 'INACTIVE'
      },
      /**
       * Validation error messages per field.
       */
      errors: {}
    };
  },
  /**
   * Returns the title for the dialog depending on the mode.
   * @returns {string}
   */
  computed: {
    dialogTitle() {
      return this.mode === 'add' ? 'Add Teacher' :
          this.mode === 'edit' ? 'Edit Teacher' :
              'Delete Teacher';
    }
  },
  watch: {
    /**
     * Watches changes to the teacherData prop and updates local state.
     */
    teacherData: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.teacher = { ...this.teacher, ...newVal };
        }
      }
    }
  },
  methods: {
    /**
     * Validates the form fields before submission.
     * @returns {boolean} True if valid, false otherwise.
     */
    validateForm() {
      this.errors = {};
      let isValid = true;

      if (!this.teacher.fullName) {
        this.errors.fullName = 'Name is required';
        isValid = false;
      }

      if (!this.teacher.email) {
        this.errors.email = 'Email is required';
        isValid = false;
      } else if (!/^\S+@\S+\.\S+$/.test(this.teacher.email)) {
        this.errors.email = 'Valid email is required';
        isValid = false;
      }

      if ((this.mode === 'add' || this.teacher.passwordHash) && !this.teacher.passwordHash) {
        this.errors.passwordHash = 'Password is required';
        isValid = false;
      }

      return isValid;
    },
    /**
     * Emits the form submission event if the form is valid.
     * @param {Event} e - The submit event.
     */
    onSubmit(e) {
      e.preventDefault();

      if (this.submitting) return;
      this.submitting = true;

      if (!this.teacher.email || !this.teacher.passwordHash) {
        alert('Email y contraseña son requeridos');
        this.submitting = false;
        return;
      }

      this.$emit('submit', this.teacher);
      this.submitting = false;
    },
    /**
     * Cancels the modal and emits events to close it.
     */
    onCancel() {
      this.$emit('cancel');
      this.$emit('update:visible', false);
    },

    /**
     * Confirms deletion and emits the confirm-delete event.
     */
    onConfirmDelete() {
      this.$emit('confirm-delete');
      this.$emit('update:visible', false);
    }
  }
};
</script>

<template>
  <div class="modal-overlay" v-if="visible" @click.self="onCancel">
    <div class="modal-content">
      <h2 class="dialog-title">{{ dialogTitle }}</h2>

      <div class="modal-body">
        <form v-if="mode === 'add' || mode === 'edit'" @submit.prevent="onSubmit" class="form-row">
          <div class="form-group">
            <label>Full Name</label>
            <input
                v-model="teacher.fullName"
                required
                class="form-control"
            >
            <span class="error-message" v-if="errors.fullName">{{ errors.fullName }}</span>
          </div>

          <div class="form-group">
            <label>Email</label>
            <input
                v-model="teacher.email"
                type="email"
                required
                class="form-control"
            >
            <span class="error-message" v-if="errors.email">{{ errors.email }}</span>
          </div>

          <div class="form-group">
            <label>Password</label>
            <input
                v-model="teacher.passwordHash"
                type="password"
                required
                class="form-control"
            >
            <span class="error-message" v-if="errors.passwordHash">{{ errors.passwordHash }}</span>
          </div>

          <div class="dialog-actions">
            <button type="button" class="btn btn-secondary" @click="onCancel">Cancel</button>
            <button type="submit" class="btn btn-primary">Save</button>
          </div>
        </form>

        <div v-if="mode === 'delete'" class="delete-confirmation">
          <p>{{ $t('teacher.modal.deleteConfirmation', { name: teacher.fullName }) }}</p>
          <p class="warning-text">{{ $t('teacher.modal.deleteWarning')}}</p>
          <div class="dialog-actions">
            <button class="btn btn-secondary" @click="onCancel">Cancel</button>
            <button class="btn btn-danger" @click="onConfirmDelete">Delete</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>



<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  border-radius: 8px;
  min-width: 400px;
  max-width: 500px;
  padding: 20px;
}

.dialog-title {
  text-align: center;
  font-weight: 500;
  color: #333;
  margin-bottom: 20px;
}

.form-row {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-group {
  margin-bottom: 15px;
}

.form-control {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.error-message {
  color: red;
  font-size: 0.8em;
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 20px;
}

.delete-confirmation {
  text-align: center;
  padding: 10px;
}

.warning-text {
  color: red;
  font-weight: 500;
}

.btn {
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
  border: none;
}

.btn-primary {
  background-color: #007bff;
  color: white;
  border: none;
}

.btn-danger {
  background-color: #dc3545;
  color: white;
  border: none;
}
</style>