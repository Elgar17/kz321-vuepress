<template>
  <div class="changelog-section">
    <h2 class="section-title">
      <span class="emoji">🚀</span>
      更新日志
    </h2>
    <div class="timeline">
      <div 
        v-for="(item, index) in updates" 
        :key="index" 
        class="timeline-item"
        :class="{ highlight: item.highlight }"
      >
        <span class="date">{{ item.date }}</span>
        <span class="content">{{ item.content }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import changelogData from '../data/changelog.json'

export default {
  name: 'Changelog',
  data() {
    return {
      updates: changelogData.updates
    }
  }
}
</script>

<style scoped>
.changelog-section {
  margin-bottom: 3rem;
  padding: 1.5rem;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 1.5rem 0;
  color: var(--vp-c-text-1);
}

.emoji {
  font-size: 1.75rem;
}

/* 时间线 */
.timeline {
  position: relative;
  padding-left: 2rem;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 0.25rem;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(180deg, #00AFCA 0%, #FEC50A 100%);
}

.timeline-item {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-bottom: 1.5rem;
  padding-left: 1rem;
}

.timeline-item::before {
  content: '';
  position: absolute;
  left: -2rem;
  top: 0.375rem;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--vp-c-brand);
  border: 2px solid var(--vp-c-bg-soft);
  box-shadow: 0 0 0 2px var(--vp-c-brand);
}

.timeline-item.highlight::before {
  background: #FEC50A;
  box-shadow: 0 0 0 2px #FEC50A;
}

.date {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--vp-c-brand);
  font-family: monospace;
}

.content {
  color: var(--vp-c-text-2);
  line-height: 1.6;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .changelog-section {
    padding: 1.25rem;
  }

  .section-title {
    font-size: 1.25rem;
  }
}
</style>
