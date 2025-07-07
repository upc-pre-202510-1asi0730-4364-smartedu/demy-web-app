<script>
import { StudentService } from '../../enrollments/services/student.service';

const studentService = new StudentService()

export default {
  name: 'StudentSelectComponent',
  props: {
    modelValue: String
  },
  emits: ['update:modelValue', 'studentChanged'],
  data() {
    return {
      students: []
    }
  },
  async mounted() {
    try {
      const response = await studentService.getAll()
      this.students = response.map(student => ({
        label: student.name,
        value: student.dni
      }))
    } catch (error) {
      console.error('Error al cargar estudiantes:', error)
    }
  },
  computed: {
    selectedStudent: {
      get() {
        return this.modelValue
      },
      set(val) {
        this.$emit('update:modelValue', val)
        this.$emit('studentChanged', val)
      }
    }
  }
}
</script>

<template>
  <div class="field">
    <label for="student" style="margin-right: 5px;">{{$t('attendance-student')}}</label>
    <pv-dropdown
        v-model="selectedStudent"
        :options="students"
        optionLabel="label"
        optionValue="value"
        placeholder="Seleccione un estudiante"
    />
  </div>
</template>
