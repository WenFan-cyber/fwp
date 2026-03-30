<template>
  <n-config-provider :theme="theme" :theme-overrides="themeOverrides">
    <n-message-provider>
      <div class="app-wrapper">
        <!-- 登录页面不显示 Header -->
        <Header v-if="!isLoginPage" />

        <!-- 主内容区 -->
        <main class="main-content">
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </main>

        <!-- 页脚 - 始终显示 -->
        <Footer />
      </div>
    </n-message-provider>
  </n-config-provider>
</template>

<script setup>
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { NConfigProvider, NMessageProvider, darkTheme } from 'naive-ui'
import { useBlogStore } from '@/stores/blog'
import Header from '@/components/common/Header.vue'
import Footer from '@/components/common/Footer.vue'

const route = useRoute()
const blogStore = useBlogStore()

const isLoginPage = computed(() => route.path === '/login')

const isDark = computed(() => blogStore.darkMode)
const theme = computed(() => blogStore.darkMode ? darkTheme : null)

const themeOverrides = computed(() => ({
  common: {
    fontSizeBase: '16px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
    fontWeightStrong: '600'
  },
  Header: {
    fontSizeLarge: '20px'
  }
}))

watch(isDark, (newVal) => {
  if (newVal) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}, { immediate: true })

// 调试信息
console.log('Footer component imported:', Footer)
console.log('Is login page:', isLoginPage.value)
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  font-size: 16px;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif;
  background-color: #f5f5f5;
  color: #333;
  transition: background-color 0.3s, color 0.3s;
  line-height: 1.8;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* 暗黑模式 */
html.dark body {
  background-color: #18181c;
  color: #ffffff;
}

.app-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding: 24px;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
}

/* 页面过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
