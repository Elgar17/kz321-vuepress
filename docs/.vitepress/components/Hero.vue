<template>
  <div class="hero-section">
    <div class="hero-content">
      <!-- 主标题 -->
      <h1 class="hero-title">
        <span class="title-main">哈萨克语导航</span>
      </h1>
      
      <!-- 副标题/标语 -->
      <p class="hero-description">
        致力于分享互联网上优质的哈萨克语网站与内容
      </p>
      
      <!-- 搜索框 -->
      <div class="hero-search">
        <input 
          v-model="searchQuery"
          type="text"
          placeholder="🔍 搜索哈萨克语网站..."
          class="search-input"
          @input="handleSearch"
        />
        <div v-if="searchResults.length > 0 && searchQuery" class="search-results">
          <a
            v-for="site in searchResults"
            :key="site.name"
            :href="site.link"
            :target="site.external ? '_blank' : '_self'"
            class="search-result-item"
            @click="searchQuery = ''"
          >
            <span class="result-icon">{{ site.icon }}</span>
            <div class="result-content">
              <div class="result-name">{{ site.name }}</div>
              <div class="result-desc">{{ site.description }}</div>
            </div>
          </a>
          <div v-if="searchResults.length === 0 && searchQuery" class="no-results">
            未找到相关网站
          </div>
        </div>
      </div>
      
      <!-- 快速链接 -->
      <div class="hero-actions">
        <a href="#工具" class="action-btn primary">
          🛠️ 实用工具
        </a>
        <a href="/about" class="action-btn secondary">
          💝 支持作者
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import sitesData from '../data/sites.json'

export default {
  name: 'Hero',
  data() {
    return {
      categories: sitesData.categories,
      searchQuery: '',
      searchResults: []
    }
  },
  computed: {
    totalSites() {
      return this.categories.reduce((total, cat) => total + cat.sites.length, 0)
    },
    allSites() {
      return this.categories.flatMap(cat => cat.sites)
    }
  },
  methods: {
    handleSearch() {
      if (!this.searchQuery.trim()) {
        this.searchResults = []
        return
      }
      
      const query = this.searchQuery.toLowerCase()
      this.searchResults = this.allSites
        .filter(site => 
          site.name.toLowerCase().includes(query) || 
          site.description.toLowerCase().includes(query)
        )
        .slice(0, 6) // 最多显示6个结果
    }
  }
}
</script>

<style scoped>
.hero-section {
  max-width: 900px;
  margin: 0 auto;
  padding: 3rem 1.5rem 2rem;
  text-align: center;
}

.hero-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

/* 标题 */
.hero-title {
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.title-main {
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, var(--vp-c-brand) 0%, var(--vp-c-accent) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.2;
}

.title-sub {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--vp-c-text-2);
  letter-spacing: 0.05em;
}

/* 描述 */
.hero-description {
  font-size: 1.125rem;
  color: var(--vp-c-text-2);
  margin: 0;
  max-width: 600px;
  line-height: 1.6;
}

/* 搜索框 */
.hero-search {
  width: 100%;
  max-width: 600px;
  position: relative;
}

.search-input {
  width: 100%;
  padding: 1rem 1.5rem;
  font-size: 1rem;
  border: 2px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  transition: all 0.3s ease;
  outline: none;
}

.search-input:focus {
  border-color: var(--vp-c-brand);
  box-shadow: 0 0 0 3px rgba(0, 175, 202, 0.1);
}

.search-input::placeholder {
  color: var(--vp-c-text-3);
}

.search-results {
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  right: 0;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  max-height: 400px;
  overflow-y: auto;
  z-index: 100;
}

.dark .search-results {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
}

.search-result-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  text-decoration: none;
  color: inherit;
  border-bottom: 1px solid var(--vp-c-divider);
  transition: background 0.2s ease;
}

.search-result-item:last-child {
  border-bottom: none;
}

.search-result-item:hover {
  background: var(--vp-c-bg-soft);
}

.result-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.result-content {
  flex: 1;
  text-align: left;
  min-width: 0;
}

.result-name {
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-bottom: 0.25rem;
}

.result-desc {
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.no-results {
  padding: 2rem;
  text-align: center;
  color: var(--vp-c-text-3);
}

/* 统计信息 */
.hero-stats {
  display: flex;
  align-items: center;
  gap: 2rem;
  padding: 1.5rem 2rem;
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  border: 1px solid var(--vp-c-divider);
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.stat-number {
  font-size: 1.75rem;
  font-weight: 700;
  background: linear-gradient(135deg, var(--vp-c-brand) 0%, var(--vp-c-accent) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-label {
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
}

.stat-divider {
  width: 1px;
  height: 2rem;
  background: var(--vp-c-divider);
}

/* 快速操作按钮 */
.hero-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.action-btn.primary {
  background: linear-gradient(135deg, var(--vp-c-brand) 0%, var(--vp-c-brand-light) 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(0, 175, 202, 0.3);
}

.action-btn.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 175, 202, 0.4);
}

.action-btn.secondary {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  border: 1px solid var(--vp-c-divider);
}

.action-btn.secondary:hover {
  border-color: var(--vp-c-brand);
  transform: translateY(-2px);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .hero-section {
    padding: 2rem 1rem 1.5rem;
  }
  
  .hero-content {
    gap: 1.5rem;
  }
  
  .title-main {
    font-size: 2rem;
  }
  
  .title-sub {
    font-size: 1rem;
  }
  
  .hero-description {
    font-size: 1rem;
  }
  
  .search-input {
    padding: 0.875rem 1.25rem;
    font-size: 0.95rem;
  }
  
  .hero-stats {
    gap: 1rem;
    padding: 1rem 1.5rem;
    width: 100%;
  }
  
  .stat-number {
    font-size: 1.5rem;
  }
  
  .stat-label {
    font-size: 0.75rem;
  }
  
  .hero-actions {
    width: 100%;
  }
  
  .action-btn {
    flex: 1;
    justify-content: center;
    min-width: 140px;
  }
}

@media (max-width: 480px) {
  .title-main {
    font-size: 1.75rem;
  }
  
  .hero-stats {
    gap: 0.75rem;
    padding: 1rem;
  }
  
  .stat-number {
    font-size: 1.25rem;
  }
  
  .stat-divider {
    height: 1.5rem;
  }
  
  .hero-actions {
    flex-direction: column;
  }
  
  .action-btn {
    width: 100%;
  }
}
</style>
