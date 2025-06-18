<script>
import { CourseService } from '../services/course.service.js'

const courseService = new CourseService()

export default {
  name: 'ClassSelectComponent',
  data() {
    return {
      courses: [],
      selectedCourseId: ''
    }
  },
  async mounted() {
    try {
      const response = await courseService.getAll()
      this.courses = response.map(course => ({
        label: course.name,
        value: course.id
      }))
    } catch (error) {
      console.error('Error al cargar cursos:', error)
    }
  },
  methods: {
    onCourseChange() {
      console.log('Curso seleccionado:', this.selectedCourseId)
      this.$emit('update:modelValue', this.selectedCourseId) // emite si usas v-model desde el padre
      this.$emit('courseChanged', this.selectedCourseId) // opcional: evento personalizado
    }
  }
}
</script>

<template>
  <div class="field">
    <label for="course" style="margin-right: 5px;">{{$t('attendance-class')}}</label>
    <pv-dropdown
        v-model="selectedCourseId"
        :options="courses"
        optionLabel="label"
        optionValue="value"
        placeholder="Seleccione un curso"
        @change="onCourseChange()"

    />
  </div>
</template>

<style scoped>

</style>