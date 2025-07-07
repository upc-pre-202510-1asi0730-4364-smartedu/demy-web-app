<script>
import { ref } from 'vue'

import EnrollmentSearch from "../components/enrollment-search.component.vue"
import EnrollmentTableComponent from "../components/enrollment-table.component.vue"

import { StudentService } from '../services/student.service.js'
import { EnrollmentService } from '../services/enrollment.service.js'
import { AcademicPeriodService } from '../services/academic-period.service.js'

const studentService = new StudentService()
const enrollmentService = new EnrollmentService()
const academicPeriodService = new AcademicPeriodService()

export default {
  name: "enrollment-page-component",
  components: {
    EnrollmentSearch,
    EnrollmentTableComponent
  },
  setup() {
    const enrollmentResults = ref(null)
    const allStudents = ref([])
    const allPeriods = ref([])
    const loading = ref(false)

    const loadInitialData = async () => {
      try {
        loading.value = true
        const [students, periods] = await Promise.all([
          studentService.getAll(),
          academicPeriodService.getAll()
        ])
        allStudents.value = students
        allPeriods.value = periods
      } catch (err) {
        console.error('Error loading initial data:', err)
      } finally {
        loading.value = false
      }
    }

    const onSearch = async (dni) => {
      try {
        loading.value = true
        console.log('Searching enrollments for DNI:', dni)

        const students = await studentService.getByDni(dni)
        if (students.length === 0) {
          console.log('No student found with DNI:', dni)
          enrollmentResults.value = {
            student: null,
            enrollments: []
          }
          return
        }

        const student = students[0]
        console.log('Student found:', student)

        const enrollments = await enrollmentService.getByStudentId(student.id)
        console.log('Enrollments found for student:', student.id, enrollments)

        const filteredEnrollments = enrollments.filter(enrollment =>
            enrollment.studentId === student.id
        )

        console.log('Filtered enrollments:', filteredEnrollments)

        enrollmentResults.value = {
          student,
          enrollments: filteredEnrollments
        }
      } catch (err) {
        console.error('Error in enrollment search:', err)
        enrollmentResults.value = {
          student: null,
          enrollments: []
        }
      } finally {
        loading.value = false
      }
    }


    const onEnrollmentStatusRequested = (enrollment) => {
      console.log('Status change requested for enrollment:', enrollment)
    }

    return {
      enrollmentResults,
      allStudents,
      allPeriods,
      loading,
      loadInitialData,
      onSearch,
      onEnrollmentStatusRequested
    }
  },
  async mounted() {
    await this.loadInitialData()
  }
}
</script>

<template>
  <div class="enrollment-page">
    <div class="page-header">
      <h3>{{ $t('enrollment.search.title') }}</h3>
    </div>

    <enrollment-search @search="onSearch"/>

    <div v-if="loading" class="loading-container">
      <p>{{ $t('enrollment.search.loading') }}</p>
    </div>

    <enrollment-table-component
        v-if="enrollmentResults && enrollmentResults.enrollments.length > 0"
        :enrollments-data="enrollmentResults.enrollments"
        :students-data="allStudents"
        :periods-data="allPeriods"
        @requested-enrollment-status="onEnrollmentStatusRequested"
    />

    <div v-else-if="enrollmentResults && enrollmentResults.enrollments.length === 0" class="no-results">
      <p>{{ $t('enrollment.search.no-results') }}</p>
    </div>

  </div>
</template>

<style scoped>
.enrollment-page {
  padding: 1rem;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 2rem;
  text-align: left;
}

.page-header h3 {
  color: var(--color-secondary-dark-1, #2c3e50);
  margin-bottom: 0.5rem;
  font-size: 1.75rem;
  font-weight: 600;
}


.loading-container {
  text-align: center;
  padding: 2rem;
  color: var(--color-secondary-dark-1, #2c3e50);
  margin-bottom: 2rem;
}

.no-results {
  text-align: center;
  padding: 2rem;
  background-color: #f8f9fa;
  border-radius: 0.5rem;
  border: 1px solid #e9ecef;
  margin-top: 1rem;
}

.no-results p {
  color: #6c757d;
  font-size: 1.1rem;
  margin: 0;
}

.search-prompt p {
  font-size: 1.1rem;
  margin: 0;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .enrollment-page {
    padding: 0.5rem;
  }

  .page-header h3 {
    font-size: 1.5rem;
  }

}
</style>