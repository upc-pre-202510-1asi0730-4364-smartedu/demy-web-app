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
          <p>Are you sure you want to delete "{{ teacher.fullName }}"?</p>
          <p class="warning-text">This action cannot be undone.</p>
          <div class="dialog-actions">
            <button class="btn btn-secondary" @click="onCancel">Cancel</button>
            <button class="btn btn-danger" @click="onConfirmDelete">Delete</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    visible: Boolean,
    mode: {
      type: String,
      validator: value => ['add', 'edit', 'delete'].includes(value)
    },
    teacherData: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      teacher: {
        fullName: '',
        email: '',
        passwordHash: '',
        role: 'TEACHER',
        status: 'INACTIVE'
      },
      errors: {}
    };
  },
  computed: {
    dialogTitle() {
      return this.mode === 'add' ? 'Add Teacher' :
          this.mode === 'edit' ? 'Edit Teacher' :
              'Delete Teacher';
    }
  },
  watch: {
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
    onCancel() {
      this.$emit('cancel');
      this.$emit('update:visible', false);
    },
    onConfirmDelete() {
      this.$emit('confirm-delete');
      this.$emit('update:visible', false);
    }
  }
};
</script>

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