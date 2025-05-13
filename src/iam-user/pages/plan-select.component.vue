<script>
import PlanSelectModel from '../../iam-user/components/plan-select-form.component.vue';
import LanguageSwitcher from '../../shared/components/language-switcher.component.vue';

export default {
  name: 'PlanSelectPage',
  components: {
    PlanSelectModel,
    LanguageSwitcher
  },
  data() {
    return {
      plans: [
        { key: 'basic' },
        { key: 'pro' },
        { key: 'elite' }
      ]
    };
  },
  methods: {
    selectPlan() {
      this.$router.push('/login');
    }
  }
}
</script>

<template>
  <div class="plan-select-container">
    <div class="header">
      <h1 class="title">{{ $t('plan-select.title') }}</h1>
      <div class="language-switcher-container">
        <LanguageSwitcher class="custom-color" />
      </div>
    </div>

    <div class="plans-container">
      <plan-select-model
          v-for="(plan, index) in plans"
          :key="index"
          :plan-key="plan.key"
          @select-plan="selectPlan"
      />
    </div>
  </div>
</template>

<style scoped>
.plan-select-container {
  background-color: #D0E3EE;
  min-height: 100vh;
  padding: 40px 20px;
}

.header {
  text-align: center;
  margin-bottom: 40px;
}

.title {
  color: #000000;
  font-size: 2.5rem;
  margin-bottom: 20px;
}

.language-switcher-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.plans-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
}

.custom-color {
  color: white;
}
</style>