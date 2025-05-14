<template>
  <div class="plan-box">
    <div class="plan-subtitle">{{ $t('plan-select.plans.' + planKey + '.subtitle') }}</div>
    <div class="plan-title">{{ $t('plan-select.plans.' + planKey + '.title') }}</div>
    <p class="price">{{ $t('plan-select.plans.' + planKey + '.price') }}</p>
    <hr class="divider" />
    <ul class="benefits-list">
      <li><div class="bullet-box"></div>{{ $t('plan-select.plans.' + planKey + '.benefit1') }}</li>
      <li><div class="bullet-box"></div>{{ $t('plan-select.plans.' + planKey + '.benefit2') }}</li>
      <li><div class="bullet-box"></div>{{ $t('plan-select.plans.' + planKey + '.benefit3') }}</li>
      <li><div class="bullet-box"></div>{{ $t('plan-select.plans.' + planKey + '.benefit4') }}</li>
    </ul>
    <button @click="$emit('select-plan')" class="select-button">
      {{ $t('plan-select.select-button') }}
    </button>
  </div>
</template>

<script>
export default {
  name: 'PlanSelectModel',
  props: {
    planKey: {
      type: String,
      required: true
    }
  },
  methods: {
    selectPlan() {
      this.$emit('select-plan');
    }
  }
}
</script>

<style scoped>
.plan-box {
  background-color: white;
  border-radius: 12px;
  padding: 30px;
  width: 320px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.plan-box:hover {
  transform: translateY(-5px);
}

.plan-subtitle {
  color: #007bff;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 0.9rem;
}

.plan-title {
  font-size: 1.8rem;
  font-weight: bold;
  margin: 10px 0;
  color: #333;
}

.price {
  font-size: 2rem;
  font-weight: bold;
  margin: 15px 0;
  color: #333;
}

.divider {
  border: none;
  height: 1px;
  background-color: #eee;
  margin: 20px 0;
}

.benefits-list {
  list-style: none;
  padding: 0;
  margin: 20px 0;
}

.benefits-list li {
  display: flex;
  align-items: center;
  margin: 12px 0;
  color: #555;
}

.bullet-box {
  width: 12px;
  height: 12px;
  background-color: #007bff;
  margin-right: 12px;
  border-radius: 2px;
}

.select-button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  cursor: pointer;
  width: 100%;
  font-weight: 500;
  transition: all 0.3s ease;
}

.select-button:hover {
  background-color: #0069d9;
}
</style>


<style scoped>
.plan-box {
  background-color: white;
  border-radius: 12px;
  padding: 30px;
  width: 320px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.plan-box:hover {
  transform: translateY(-5px);
}

.plan-subtitle {
  color: #007bff;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 0.9rem;
}

.plan-title {
  font-size: 1.8rem;
  font-weight: bold;
  margin: 10px 0;
  color: #333;
}

.price {
  font-size: 2rem;
  font-weight: bold;
  margin: 15px 0;
  color: #333;
}

.divider {
  border: none;
  height: 1px;
  background-color: #eee;
  margin: 20px 0;
}

.benefits-list {
  list-style: none;
  padding: 0;
  margin: 20px 0;
}

.benefits-list li {
  display: flex;
  align-items: center;
  margin: 12px 0;
  color: #555;
}

.bullet-box {
  width: 12px;
  height: 12px;
  background-color: #007bff;
  margin-right: 12px;
  border-radius: 2px;
}

.select-button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  cursor: pointer;
  width: 100%;
  font-weight: 500;
  transition: all 0.3s ease;
}

.select-button:hover {
  background-color: #0069d9;
}
</style>