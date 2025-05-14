<script>
import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';
import { AcademicPeriod } from "../model/academic-period.entity.js";
import { AcademicPeriodService } from "../services/academic-period.service.js";
import AcademicPeriodCreateAndEditComponent from "../components/academic-period-create-and-edit.component.vue";

export default defineComponent({
  name: 'AcademicPeriodManagementComponent',
  components: {
    AcademicPeriodCreateAndEditComponent
  },
  setup() {
    const { t } = useI18n();
    return { t };
  },
  data() {
    return {
      academicPeriods: [],
      academicPeriodData: new AcademicPeriod(),
      editMode: false,
      loading: false,
      columnsToDisplay: [
        { field: 'name', header: 'academic-period.table.name' },
        { field: 'startDate', header: 'academic-period.table.start-date' },
        { field: 'endDate', header: 'academic-period.table.end-date' },
        { field: 'actions', header: 'academic-period.table.actions' }
      ],
      academicPeriodService: new AcademicPeriodService()
    };
  },
  mounted() {
    this.getAllAcademicPeriods();
  },
  methods: {
    async getAllAcademicPeriods() {
      this.loading = true;
      this.academicPeriods = await this.academicPeriodService.getAll();
      this.loading = false;
    },
    async createAcademicPeriod() {
      const created = await this.academicPeriodService.create(this.academicPeriodData);
      this.academicPeriods.push(created);
    },
    async updateAcademicPeriod() {
      const updated = await this.academicPeriodService.update(this.academicPeriodData.id, this.academicPeriodData);
      const index = this.academicPeriods.findIndex(p => p.id === updated.id);
      if (index !== -1) this.academicPeriods[index] = updated;
    },
    async deleteAcademicPeriod(id) {
      await this.academicPeriodService.delete(id);
      this.academicPeriods = this.academicPeriods.filter(p => p.id !== id);
    },
    onEditItem(period) {
      this.editMode = true;
      this.academicPeriodData = new AcademicPeriod(period);
    },
    onCancelRequested() {
      this.resetEditState();
      this.getAllAcademicPeriods();
    },
    async onAcademicPeriodAddRequested(period) {
      this.academicPeriodData = period;
      await this.createAcademicPeriod();
      this.resetEditState();
    },
    async onAcademicPeriodUpdateRequested(period) {
      this.academicPeriodData = period;
      await this.updateAcademicPeriod();
      this.resetEditState();
    },
    resetEditState() {
      this.academicPeriodData = new AcademicPeriod();
      this.editMode = false;
    }
  }
});
</script>

<template>
  <div class="container">
    <div class="header">
      <h4>{{ t('academic-period.management.title') }}</h4>
    </div>

    <div class="academic-period-form-container">
      <AcademicPeriodCreateAndEditComponent
          v-model="academicPeriodData"
          :editMode="editMode"
          @cancel="onCancelRequested"
          @add-academic-period="onAcademicPeriodAddRequested"
          @update-academic-period="onAcademicPeriodUpdateRequested"
      />
    </div>

    <div class="table-container">
      <DataTable
          :value="academicPeriods"
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
          <template v-if="col.field === 'startDate' || col.field === 'endDate'" #body="slotProps">
            {{ new Date(slotProps.data[col.field]).toLocaleDateString() }}
          </template>

          <template v-else-if="col.field === 'actions'" #body="slotProps">
            <Button
                icon="pi pi-pencil"
                class="p-button-rounded p-button-info p-button-sm"
                @click="onEditItem(slotProps.data)"
                :aria-label="t('academic-period.table.edit')"
            />
            <Button
                icon="pi pi-trash"
                class="p-button-rounded p-button-danger p-button-sm ml-2"
                @click="deleteAcademicPeriod(slotProps.data.id)"
                :aria-label="t('academic-period.table.delete')"
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
