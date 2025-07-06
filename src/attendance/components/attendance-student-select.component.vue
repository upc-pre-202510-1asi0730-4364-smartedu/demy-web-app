<script>
import { StudentService } from '../../enrollments/services/student.service';

const studentService = new StudentService()

export default {
  name: 'StudentSelectComponent',
  data() {
    return {
      students: [],
      selectedStudentId: ''
    }
  },
  async mounted() {
    try {
      const response = await studentService.getAll()
      this.students = [
        { label: 'Todos los alumnos', value: '' }, // ✅ opción para ver todos
        ...response.map(student => ({
          label: `${student.firstName} ${student.lastName}`,
          value: student.id
        }))
      ]
    } catch (error) {
      console.error('Error al cargar estudiantes:', error)
    }
  },
  methods: {
    onStudentChange() {
      console.log('Estudiante seleccionado:', this.selectedStudentId)
      this.$emit('update:modelValue', this.selectedStudentId) // emite si usas v-model desde el padre
      this.$emit('studentChanged', this.selectedStudentId) // opcional: evento personalizado
    }
  }
}
</script>

<template>
  <div class="field">
    <label for="course" style="margin-right: 5px;">{{$t('attendance-student')}}</label>
    <pv-dropdown
        v-model="selectedStudentId"
        :options="students"
        optionLabel="label"
        optionValue="value"
        placeholder="Seleccione un estudiante"
        @change="onStudentChange()"

    />
  </div>
</template>

<style scoped>

</style>