<script>
import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';
import { Enrollment } from "../model/enrollment.entity.js";
import { StudentService } from "../services/student.service.js";
import { AcademicPeriodService } from "../services/academic-period.service.js";
import { EnrollmentService } from "../services/enrollment.service.js";
import EnrollmentCreateAndEditComponent from "../components/enrollment-create-and-edit.component.vue";

export default defineComponent({
  name: 'EnrollmentManagementComponent',
  components: {
    EnrollmentCreateAndEditComponent
  },
  setup() {
    const { t } = useI18n();
    return { t };
  },
  data() {
    return {
      enrollments: [],
      enrollmentData: new Enrollment(),
      editMode: false,
      loading: false,
      columnsToDisplay: [
        { field: 'id', header: 'enrollment.table.id' },
        { field: 'studentId', header: 'enrollment.table.student' },
        { field: 'periodId', header: 'enrollment.table.period' },
        { field: 'createdAt', header: 'enrollment.table.date' },
        { field: 'amount', header: 'enrollment.table.amount' },
        { field: 'enrollmentStatus', header: 'enrollment.table.status' },
        { field: 'paymentStatus', header: 'enrollment.table.payment-status' },
        { field: 'actions', header: 'enrollment.table.actions' }
      ],
      studentMap: new Map(),
      periodMap: new Map(),
      enrollmentService: new EnrollmentService(),
      studentService: new StudentService(),
      academicPeriodService: new AcademicPeriodService()
    };
  },
  mounted() {
    this.loadAll();
  },
  methods: {
    async loadAll() {
      this.loading = true;
      const [enrollments, students, periods] = await Promise.all([
        this.enrollmentService.getAll(),
        this.studentService.getAll(),
        this.academicPeriodService.getAll()
      ]);
      this.enrollments = enrollments;
      this.studentMap = new Map(students.map(s => [s.id, `${s.firstName} ${s.lastName}`]));
      this.periodMap = new Map(periods.map(p => [p.id, p.name]));
      this.loading = false;
    },
    async createEnrollment() {
      const created = await this.enrollmentService.create(this.enrollmentData);
      this.enrollments.push(created);
    },
    async updateEnrollment() {
      const updated = await this.enrollmentService.update(this.enrollmentData.id, this.enrollmentData);
      const index = this.enrollments.findIndex(e => e.id === updated.id);
      if (index !== -1) this.enrollments[index] = updated;
    },
    async deleteEnrollment(id) {
      await this.enrollmentService.delete(id);
      this.enrollments = this.enrollments.filter(e => e.id !== id);
    },
    onEditItem(enrollment) {
      this.editMode = true;
      this.enrollmentData = new Enrollment(enrollment);
    },
    onCancelRequested() {
      this.resetEditState();
      this.loadAll();
    },
    async onEnrollmentAddRequested(enrollment) {
      this.enrollmentData = enrollment;
      await this.createEnrollment();
      this.resetEditState();
    },
    async onEnrollmentUpdateRequested(enrollment) {
      this.enrollmentData = enrollment;
      await this.updateEnrollment();
      this.resetEditState();
    },
    resetEditState() {
      this.editMode = false;
      this.enrollmentData = new Enrollment();
    }
  }
});
</script>

<template>
  <div class="container">
    <div class="header">
      <h4>{{ t('enrollment.management.title') }}</h4>
    </div>

    <div class="enrollment-form-container">
      <EnrollmentCreateAndEditComponent
          v-model="enrollmentData"
          :editMode="editMode"
          @cancel="onCancelRequested"
          @add-enrollment="onEnrollmentAddRequested"
          @update-enrollment="onEnrollmentUpdateRequested"
      />
    </div>

    <div class="table-container">
      <DataTable
          :value="enrollments"
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
          <!-- Custom cells -->
          <template v-if="col.field === 'studentId'" #body="slotProps">
            {{ studentMap.get(slotProps.data.studentId) || '—' }}
          </template>

          <template v-else-if="col.field === 'periodId'" #body="slotProps">
            {{ periodMap.get(slotProps.data.periodId) || '—' }}
          </template>

          <template v-else-if="col.field === 'createdAt'" #body="slotProps">
            {{ new Date(slotProps.data.createdAt).toLocaleDateString() }}
          </template>

          <template v-else-if="col.field === 'enrollmentStatus'" #body="slotProps">
            {{ slotProps.data.enrollmentStatus === 'ACTIVE'
              ? t('enrollment.status.active')
              : t('enrollment.status.inactive') }}
          </template>

          <template v-else-if="col.field === 'paymentStatus'" #body="slotProps">
            {{ slotProps.data.paymentStatus === 'PAID'
              ? t('enrollment.payment.paid')
              : t('enrollment.payment.unpaid') }}
          </template>

          <template v-else-if="col.field === 'actions'" #body="slotProps">
            <Button
                icon="pi pi-pencil"
                class="p-button-rounded p-button-info p-button-sm"
                @click="onEditItem(slotProps.data)"
                :aria-label="t('enrollment.table.edit')"
            />
            <Button
                icon="pi pi-trash"
                class="p-button-rounded p-button-danger p-button-sm ml-2"
                @click="deleteEnrollment(slotProps.data.id)"
                :aria-label="t('enrollment.table.delete')"
            />
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>

<style scoped>
.container {
  padding: 0.5rem;
  max-width: 1200px;
  margin: 0 auto;
}
.header h4 {
  text-align: center;
  margin-bottom: 1rem;
  font-size: 1.5rem;
  font-weight: 500;
}
.table-container {
  width: 100%;
  overflow-x: auto;
  background-color: #fff;
  padding: 1rem;
}
</style>
