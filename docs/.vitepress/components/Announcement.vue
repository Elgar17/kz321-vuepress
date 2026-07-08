<template>
  <a
    class="announcement"
    href="https://github.com/Elgar17/kazlab"
    target="_blank"
    rel="noopener noreferrer"
  >
    <span class="announcement-badge">新</span>
    <span class="announcement-icon">🎙️</span>
    <div class="announcement-body">
      <p class="announcement-title">Mac 桌面版语音合成工具已发布</p>
      <p class="announcement-desc">
        kazlab —— 完全离线的哈萨克语文本转语音应用，支持多说话人，点击前往下载。
      </p>
    </div>
    <span class="announcement-cta">下载 →</span>
  </a>
</template>

<script>
export default {
  name: "Announcement",
}
</script>

<style scoped>
.announcement {
  display: flex;
  align-items: center;
  gap: 14px;
  max-width: 900px;
  margin: 0 auto 1.5rem;
  padding: 16px 20px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  background: linear-gradient(135deg, var(--vp-c-brand-soft) 0%, var(--vp-c-bg-soft) 100%);
  color: var(--vp-c-text-1);
  text-decoration: none;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}

.announcement:hover {
  transform: translateY(-2px);
  border-color: var(--vp-c-brand);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.announcement-badge {
  flex: 0 0 auto;
  padding: 2px 8px;
  border-radius: 999px;
  background: var(--vp-c-brand);
  color: #fff;
  font-size: 0.72rem;
  font-weight: 700;
}

.announcement-icon {
  flex: 0 0 auto;
  font-size: 1.6rem;
}

.announcement-body {
  flex: 1;
  min-width: 0;
}

.announcement-title {
  margin: 0 0 2px;
  font-size: 1rem;
  font-weight: 700;
}

.announcement-desc {
  margin: 0;
  color: var(--vp-c-text-2);
  font-size: 0.88rem;
  line-height: 1.5;
}

.announcement-cta {
  flex: 0 0 auto;
  padding: 8px 16px;
  border-radius: 8px;
  background: var(--vp-c-brand);
  color: #fff;
  font-size: 0.88rem;
  font-weight: 600;
  white-space: nowrap;
}

@media (max-width: 768px) {
  .announcement {
    flex-wrap: wrap;
    padding: 14px 16px;
  }

  .announcement-cta {
    width: 100%;
    text-align: center;
  }
}
</style>
