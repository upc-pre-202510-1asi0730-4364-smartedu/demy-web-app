<script>
import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';
import { Student } from "../model/student.entity.js";
import { StudentService } from "../services/student.service.js";
import StudentCreateAndEditComponent from "../components/student-create-and-edit.component.vue";

export default defineComponent({
  name: 'StudentManagementComponent',
  components: {
    StudentCreateAndEditComponent
  },
  setup() {
    const { t } = useI18n();
    return { t };
  },
  data() {
    return {
      students: [],
      studentData: new Student(),
      editMode: false,
      loading: false,
      columnsToDisplay: [
        { field: 'dni', header: 'student.table.dni' },
        { field: 'firstName', header: 'student.table.first-name' },
        { field: 'lastName', header: 'student.table.last-name' },
        { field: 'sex', header: 'student.table.sex' },
        { field: 'birthDate', header: 'student.table.birth-date' },
        { field: 'actions', header: 'student.table.actions' }
      ],
      studentService: new StudentService()
    };
  },
  mounted() {
    this.getAllStudents();
  },
  methods: {
    async getAllStudents() {
      this.loading = true;
      this.students = await this.studentService.getAll();
      this.loading = false;
    },
    async createStudent() {
      const created = await this.studentService.create(this.studentData);
      this.students.push(created);
    },
    async updateStudent() {
      const updated = await this.studentService.update(this.studentData.id, this.studentData);
      const index = this.students.findIndex(s => s.id === updated.id);
      if (index !== -1) this.students[index] = updated;
    },
    async deleteStudent(id) {
      await this.studentService.delete(id);
      this.students = this.students.filter(s => s.id !== id);
    },
    onEditItem(student) {
      this.editMode = true;
      this.studentData = new Student(student);
    },
    onCancelRequested() {
      this.resetEditState();
      this.getAllStudents();
    },
    async onStudentAddRequested(student) {
      this.studentData = student;
      await this.createStudent();
      this.resetEditState();
    },
    async onStudentUpdateRequested(student) {
      this.studentData = student;
      await this.updateStudent();
      this.resetEditState();
    },
    resetEditState() {
      this.editMode = false;
      this.studentData = new Student();
    }
  }
});
</script>

<template>
  <div class="container">
    <div class="header">
      <h4>{{ t('student.management.title') }}</h4>
    </div>

    <div class="student-form-container">
      <StudentCreateAndEditComponent
          v-model="studentData"
          :editMode="editMode"
          @cancel="onCancelRequested"
          @add-student="onStudentAddRequested"
          @update-student="onStudentUpdateRequested"
      />
    </div>

    <div class="table-container">
      <DataTable
          :value="students"
          :loading="loading"
          :paginator="true"
          :rows="10"
          :rowsPerPageOptions="[5, 10, 25, 50]"
          sortMode="multiple"
          dataKey="id"
          responsiveLayout="scroll"
      >
        <Column
            v-for="col in columnsToDisplay"
            :key="col.field"
            :field="col.field"
            :header="t(col.header)"
            :sortable="col.field !== 'actions'"
        >
          <template v-if="col.field === 'actions'" #body="slotProps">
            <Button
                icon="pi pi-pencil"
                class="p-button-rounded p-button-info p-button-sm"
                @click="onEditItem(slotProps.data)"
                :aria-label="t('student.table.edit')"
            />
            <Button
                icon="pi pi-trash"
                class="p-button-rounded p-button-danger p-button-sm ml-2"
                @click="deleteStudent(slotProps.data.id)"
                :aria-label="t('student.table.delete')"
            />
          </template>

          <template v-else-if="col.field === 'sex'" #body="slotProps">
            {{ slotProps.data.sex === 'MALE' ? t('student.sex.male') : t('student.sex.female') }}
          </template>

          <template v-else-if="col.field === 'birthDate'" #body="slotProps">
            {{ new Date(slotProps.data.birthDate).toLocaleDateString() }}
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>

<style scoped>
.container {
  padding: 2rem;
}

.header h4 {
  text-align: center;
  margin-bottom: 1.5rem;
}

.student-form-container {
  margin-bottom: 2rem;
}

.table-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  padding: 1rem;
}

</style>
