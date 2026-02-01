<template>
  <div class="site-cards-container">
    <div class="category-section" v-for="category in categories" :key="category.id">
      <h2 class="category-title">
        <span class="category-icon">{{ category.icon }}</span>
        {{ category.title.replace(/^[^\s]+\s/, '') }}
      </h2>
      <div class="cards-grid">
        <a
          v-for="site in category.sites"
          :key="site.name"
          :href="site.link"
          :target="site.external ? '_blank' : '_self'"
          :rel="site.external ? 'noopener noreferrer' : ''"
          class="site-card"
        >
          <div class="card-icon">{{ site.icon }}</div>
          <div class="card-content">
            <h3 class="card-title">
              {{ site.name }}
              <span v-if="site.external" class="external-icon">↗</span>
            </h3>
            <p class="card-description">{{ site.description }}</p>
          </div>
        </a>
      </div>
    </div>

    <div class="footer-section">
      <a href="https://support.qq.com/products/369710" target="_blank" rel="noopener noreferrer" class="submit-link">
        💡 提交网站
      </a>
    </div>
  </div>
</template>

<script>
import sitesData from '../data/sites.json'

export default {
  name: 'SiteCards',
  data() {
    return {
      categories: sitesData.categories
    }
  }
}
</script>

<style scoped>
.site-cards-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 1.5rem;
}

.category-section {
  margin-bottom: 2rem;
}

.category-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 1rem;
  padding-bottom: 0.375rem;
  border-bottom: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-1);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.category-icon {
  font-size: 1.25rem;
  line-height: 1;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}

.site-card {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.25rem;
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
  background-color: var(--vp-c-bg-soft);
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
  cursor: pointer;
}

.site-card:hover {
  border-color: var(--vp-c-brand);
  background-color: var(--vp-c-bg);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.dark .site-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.card-icon {
  font-size: 2rem;
  line-height: 1;
  flex-shrink: 0;
}

.card-content {
  flex: 1;
  min-width: 0;
}

.card-title {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  color: var(--vp-c-text-1);
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.external-icon {
  font-size: 0.75rem;
  opacity: 0.6;
}

.card-description {
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
  margin: 0;
  line-height: 1.5;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.footer-section {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--vp-c-divider);
  text-align: center;
}

.submit-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  /* 使用哈萨克斯坦国旗的金黄色 */
  background: linear-gradient(135deg, #FEC50A 0%, #FFDB4D 100%);
  color: #1a1a1a;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(254, 197, 10, 0.3);
}

.submit-link:hover {
  background: linear-gradient(135deg, #FFDB4D 0%, #FEC50A 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(254, 197, 10, 0.5);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .site-cards-container {
    padding: 1rem;
  }

  .category-section {
    margin-bottom: 1.5rem;
  }

  .category-title {
    font-size: 1rem;
    margin-bottom: 0.75rem;
    padding-bottom: 0.25rem;
  }

  .cards-grid {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }

  .site-card {
    padding: 1rem;
  }

  .card-icon {
    font-size: 1.5rem;
  }

  .card-title {
    font-size: 0.95rem;
  }

  .card-description {
    font-size: 0.8rem;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .cards-grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  }
}
</style>
