<script>
import Card from 'primevue/card'
import { RouterLink } from 'vue-router'

export default {
  name: 'organization-option',
  components: {
    Card,
    RouterLink
  },
  props: {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      default: ''
    },
    image: {
      type: String,
      required: true
    },
    route: {
      type: String,
      required: true
    }
  }
}
</script>

<template>
  <RouterLink :to="route" class="card-link">
    <Card class="option-card">
      <template #header v-if="image">
        <img :src="image" :alt="$t(title)" class="card-image" />
      </template>

      <template #title>
        {{ $t(title) }}
      </template>

      <template #content>
        <p v-if="description">{{ $t(description) }}</p>
      </template>
    </Card>
  </RouterLink>
</template>

<style scoped>
.card-link {
  text-decoration: none;
  color: inherit;
  display: block;
  height: 100%;
}

.option-card {
  border-radius: 1rem;
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  background-color: var(--bg-light-gray);
  color: black;
  text-align: center;
}

.option-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.15);
}

.card-image {
  display: block;
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-top-left-radius: 1rem;
  border-top-right-radius: 1rem;
}

.card-text {
  padding: 1rem;
}

.p-card-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.p-card-content p {
  font-size: 0.95rem;
}
</style>