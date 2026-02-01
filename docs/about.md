---
sidebar: false
---

<div class="support-page">

<div class="hero-section">
  <h1 class="page-title">
    <span class="icon">💝</span>
    支持作者
  </h1>
  <p class="hero-desc">感谢您使用 KZ321.top 哈萨克语导航！</p>
</div>

<div class="support-section">
  <div class="support-card">
    <h2 class="section-title">
      <span class="emoji">☕</span>
      请作者喝杯咖啡
    </h2>
    <p class="support-text">
      如果这个网站对您有帮助，欢迎通过微信赞赏支持我继续维护和更新。<br>
      您的支持是我持续优化的最大动力！
    </p>
    <div class="qr-container">
      <img src="/qr.png" alt="微信收款码" class="qr-code" />
      <p class="qr-hint">微信扫码支持</p>
    </div>
  </div>
</div>

<div class="about-section">
  <h2 class="section-title">
    <span class="emoji">🎉</span>
    关于 KZ321
  </h2>
  <div class="about-content">
    <p>本人收集了一些哈萨语网站，致敬曾经的 KZ321 导航网站，做成了一个导航网站。</p>
    <p class="backup-link">备用网址：<a href="https://kz321.netlify.app" target="_blank">https://kz321.netlify.app</a></p>
  </div>
</div>

<div class="contact-section">
  <h2 class="section-title">
    <span class="emoji">💌</span>
    联系作者
  </h2>
  <div class="contact-info">
    <div class="contact-item">
      <span class="contact-label">微信</span>
      <span class="contact-value">HARAHOZI_</span>
    </div>
  </div>
</div>

<Changelog />

<div class="comment-section">
  <Valine/>
</div>

</div>

<style scoped>
.support-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}

/* 英雄区域 */
.hero-section {
  text-align: center;
  margin-bottom: 3rem;
}

.page-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 1rem 0;
  background: linear-gradient(135deg, #00AFCA 0%, #FEC50A 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-title .icon {
  font-size: 2.75rem;
}

.hero-desc {
  font-size: 1.125rem;
  color: var(--vp-c-text-2);
  margin: 0;
}

/* 支持区域 */
.support-section {
  margin-bottom: 3rem;
}

.support-card {
  background: linear-gradient(135deg, rgba(0, 175, 202, 0.05) 0%, rgba(254, 197, 10, 0.05) 100%);
  border: 2px solid var(--vp-c-brand);
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
  color: var(--vp-c-text-1);
}

.support-card .section-title {
  justify-content: center;
}

.emoji {
  font-size: 1.75rem;
}

.support-text {
  color: var(--vp-c-text-2);
  line-height: 1.7;
  margin-bottom: 2rem;
}

.qr-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.qr-code {
  max-width: 280px;
  width: 100%;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 4px solid #fff;
  background: #fff;
}

.qr-hint {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--vp-c-brand);
  margin: 0;
}

/* 关于区域 */
.about-section,
.contact-section,
.changelog-section {
  margin-bottom: 3rem;
  padding: 1.5rem;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
}

.about-section .section-title,
.contact-section .section-title,
.changelog-section .section-title {
  justify-content: flex-start;
  margin-bottom: 1.5rem;
}

.about-content p {
  color: var(--vp-c-text-2);
  line-height: 1.7;
  margin: 0 0 0.75rem 0;
}

.backup-link {
  font-size: 0.95rem;
}

.backup-link a {
  color: var(--vp-c-brand);
  text-decoration: none;
  font-weight: 500;
}

.backup-link a:hover {
  text-decoration: underline;
}

/* 联系信息 */
.contact-info {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1rem;
  background: var(--vp-c-bg);
  border-radius: 6px;
  border: 1px solid var(--vp-c-divider);
}

.contact-label {
  font-weight: 600;
  color: var(--vp-c-text-1);
  min-width: 60px;
}

.contact-value {
  color: var(--vp-c-brand);
  font-weight: 500;
  font-family: monospace;
  font-size: 1.05rem;
}

/* 评论区域 */
.comment-section {
  margin-top: 3rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .support-page {
    padding: 1.5rem 1rem;
  }

  .page-title {
    font-size: 2rem;
  }

  .page-title .icon {
    font-size: 2.25rem;
  }

  .hero-desc {
    font-size: 1rem;
  }

  .support-card {
    padding: 1.5rem;
  }

  .section-title {
    font-size: 1.25rem;
  }

  .qr-code {
    max-width: 220px;
  }

  .about-section,
  .contact-section,
  .changelog-section {
    padding: 1.25rem;
  }
}

/* 暗色模式优化 */
.dark .qr-code {
  border-color: var(--vp-c-bg-soft);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.dark .support-card {
  background: linear-gradient(135deg, rgba(51, 196, 218, 0.08) 0%, rgba(255, 219, 77, 0.08) 100%);
}
</style>