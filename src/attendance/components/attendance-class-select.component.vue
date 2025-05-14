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
  }
}
</script>

<template>
  <div class="field">
    <label for="course">{{$t('attendance-class')}}</label>
    <pv-dropdown
        v-model="selectedCourseId"
        :options="courses"
        optionLabel="label"
        optionValue="value"
        placeholder="Seleccione un curso"
    />
  </div>
</template>

<style scoped>

</style>