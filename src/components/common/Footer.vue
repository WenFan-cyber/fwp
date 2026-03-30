<template>
  <footer class="site-footer">
    <div class="footer-content">
      <!-- 左侧信息区 -->
      <div class="footer-left">
        <div class="footer-brand">
          <div class="brand-logo">🌐</div>
          <div class="brand-info">
            <h3 class="brand-title">Cijiu's Network Lab</h3>
            <p class="brand-desc">记录网络工程师的学习与实践</p>
          </div>
        </div>

        <div class="contact-info">
          <div class="contact-item">
            <n-icon :component="MailOutline" />
            <span>contact@wenpingfan@.com</span>
          </div>
          <div class="contact-item">
            <n-icon :component="LocationOutline" />
            <span>中国 · 上海</span>
          </div>
        </div>

        <div class="tech-tags">
          <n-tag type="info" size="small" round>Vue3</n-tag>
          <n-tag type="success" size="small" round>Vite</n-tag>
          <n-tag type="warning" size="small" round>Naive UI</n-tag>
          <n-tag type="error" size="small" round>Pinia</n-tag>
        </div>
      </div>

      <!-- 中间导航区 -->
      <div class="footer-center">
        <div class="footer-column">
          <h4 class="column-title">
            <n-icon :component="RocketOutline" />
            快速导航
          </h4>
          <ul class="column-links">
            <li><router-link to="/">首页</router-link></li>
            <li><router-link to="/about">关于我</router-link></li>
            <li><router-link to="/projects">项目经历</router-link></li>
            <li><router-link to="/notes">学习笔记</router-link></li>
          </ul>
        </div>

        <div class="footer-column">
          <h4 class="column-title">
            <n-icon :component="CodeSlashOutline" />
            技术方向
          </h4>
          <ul class="column-links"; style="color: #99979d">
            <li>路由交换</li>
            <li>网络安全</li>
            <li>无线网络</li>
            <li>数据中心</li>
          </ul>
        </div>

        <div class="footer-column">
          <h4 class="column-title">
            <n-icon :component="LinkOutline" />
            资源链接
          </h4>
          <ul class="column-links">
            <li><a href="https://cn.vuejs.org/" target="_blank">Vue.js 官方文档</a></li>
            <li><a href="https://www.naiveui.com/" target="_blank">Naive UI 组件库</a></li>
            <li><a href="https://vitejs.dev/" target="_blank">Vite 构建工具</a></li>
            <li><a href="https://github.com/" target="_blank">GitHub</a></li>
          </ul>
        </div>
      </div>

      <!-- 右侧统计区 -->
      <div class="footer-right">
        <div class="social-links">
          <n-button quaternary circle @click="openGithub">
            <template #icon>
              <n-icon :component="LogoGithub" />
            </template>
          </n-button>
          <n-button quaternary circle @click="toggleDarkMode">
            <template #icon>
              <n-icon :component="isDark ? SunnyOutline : MoonOutline" />
            </template>
          </n-button>
          <n-button quaternary circle @click="shareSite">
            <template #icon>
              <n-icon :component="ShareOutline" />
            </template>
          </n-button>
        </div>

        <div class="stats-info">
          <div class="stat-item">
            <n-icon :component="CodeOutline" />
            <span>4 篇文章</span>
          </div>
          <div class="stat-item">
            <n-icon :component="EyeOutline" />
            <span>885 次浏览</span>
          </div>
        </div>

        <div class="safe-days">
          <n-icon :component="FlashOutline" />
          <span>安全运行 74 天</span>
        </div>
      </div>
    </div>

    <!-- 底部版权信息 -->
    <div class="footer-bottom">
      <div class="footer-bottom-content">
        <p>© 2026 WSY's Network Lab. All rights reserved.</p>
        <span class="divider">|</span>
        <p>鄂 ICP 备 XXXXXXXX 号</p>
        <span class="divider">|</span>
        <p>Powered by Vue3 + Vite + Naive UI</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useBlogStore } from '@/stores/blog'
import {
  MailOutline,
  LocationOutline,
  RocketOutline,
  CodeSlashOutline,
  LinkOutline,
  LogoGithub,
  SunnyOutline,
  MoonOutline,
  ShareOutline,
  CodeOutline,
  EyeOutline,
  FlashOutline
} from '@vicons/ionicons5'
import { NTag, NButton, NIcon } from 'naive-ui'

const router = useRouter()
const blogStore = useBlogStore()

const isDark = computed(() => blogStore.darkMode)

const toggleDarkMode = () => {
  blogStore.setDarkMode(!blogStore.darkMode)
}

const openGithub = () => {
  window.open('https://github.com/', '_blank')
}

const shareSite = () => {
  if (navigator.share) {
    navigator.share({
      title: 'WSY\'s Network Lab',
      url: window.location.href
    })
  } else {
    navigator.clipboard.writeText(window.location.href)
    alert('链接已复制到剪贴板')
  }
}
</script>

<style scoped>
.site-footer {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding: 48px 24px 24px;
  margin-top: 80px;
}

html.dark .site-footer {
  background: linear-gradient(135deg, #0d0d0d 0%, #1a1a1a 100%);
  border-top-color: rgba(255, 255, 255, 0.08);
}

.footer-content {
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1.5fr 2fr 1fr;
  gap: 48px;
  margin-bottom: 32px;
}

.footer-left {
  margin-bottom: 20px;
}

.footer-left .footer-brand {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.footer-left .brand-logo {
  font-size: 40px;
}

.footer-left .brand-title {
  font-size: 20px;
  font-weight: 600;
  color: #eadcdc;
  margin: 0 0 4px 0;
}

.footer-left .brand-desc {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
}

.footer-left .contact-info {
  margin-bottom: 20px;
}

.footer-left .contact-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
}

.footer-left .contact-item .n-icon {
  font-size: 16px;
  color: #4a90e2;
}

.footer-left .tech-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.footer-center {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
}

.footer-center .footer-column {
  margin-bottom: 20px;
}

.footer-center .column-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 20px;
}

.footer-center .column-title .n-icon {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.6);
}

.footer-center .column-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-center .column-links li {
  margin-bottom: 12px;
}

.footer-center .column-links li a,
.footer-center .column-links li span {
  color: rgba(252, 247, 247, 0.6);
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s;
}

.footer-center .column-links li a:hover,
.footer-center .column-links li span:hover {
  color: #4a90e2;
}

.footer-right {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

.footer-right .social-links {
  display: flex;
  gap: 12px;
}

.footer-right .social-links .n-button {
  color: rgba(255, 255, 255, 0.7);
}

.footer-right .social-links .n-button:hover {
  color: #bdafaf;
}

.footer-right .stats-info {
  display: flex;
  gap: 16px;
}

.footer-right .stats-info .stat-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  color: rgba(234, 220, 220, 0.7);
  font-size: 13px;
}

.footer-right .stats-info .stat-item .n-icon {
  font-size: 16px;
  color: #4a90e2;
}

.footer-right .safe-days {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: rgba(76, 175, 80, 0.1);
  border: 1px solid rgba(76, 175, 80, 0.3);
  border-radius: 8px;
  color: #4caf50;
  font-size: 13px;
  font-weight: 500;
}

.footer-right .safe-days .n-icon {
  font-size: 16px;
}

.footer-bottom {
  max-width: 1400px;
  margin: 0 auto;
  padding-top: 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  text-align: center;
}

.footer-bottom-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
}

.footer-bottom-content p {
  margin: 0;
  color: rgba(234, 204, 204, 0.5);
  font-size: 13px;
}

.footer-bottom-content .divider {
  color: rgba(255, 255, 255, 0.2);
}

@media (max-width: 1024px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: 32px;
  }

  .footer-center {
    grid-template-columns: 1fr;
    gap: 24px;
  }
}
</style>