<script>
import OrganizationOption from "../components/organization-option.component.vue";

export default {
  name: 'organization',
  components: {
    OrganizationOption
  },
  data() {
    return {
      options: [
        {
          title: 'organization.courses.title',
          description: 'organization.courses.description',
          image: 'assets/img/organization-courses.jpg',
          route: '/organization/courses'
        },
        {
          title: 'organization.periods.title',
          description: 'organization.periods.description',
          image: 'assets/img/organization-periods.jpg',
          route: '/organization/periods'
        },
        {
          title: 'organization.rooms.title',
          description: 'organization.rooms.description',
          image: 'assets/img/organization-rooms.jpg',
          route: '/organization/classrooms'
        },
        {
          title: 'organization.teachers.title',
          description: 'organization.teachers.description',
          image: 'assets/img/organization-teachers.jpg',
          route: '/organization/teachers'
        },
        {
          title: 'organization.weekly.title',
          description: 'organization.weekly.description',
          image: 'assets/img/organization-weekly.jpg',
          route: '/organization/weekly-schedules'
        }
      ]
    }
  }
}
</script>

<template>
  <div class="grid-container">
    <organization-option
        v-for="option in options"
        :key="option.route"
        :title="option.title"
        :description="option.description"
        :image="option.image"
        :route="option.route"
    />
  </div>
</template>

<style scoped>
.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

organization-option {
  display: block;
  height: 100%;
}

.option-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

@media (max-width: 1024px) {
  .grid-container {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .grid-container {
    grid-template-columns: 1fr;
  }
}
</style>