<template>
  <header class="site-header">
    <div class="header-container">
      <!-- Logo 区域 -->
      <div class="logo-section">
        <router-link to="/" class="logo-link">
          <div class="logo-icon">🌐</div>
          <div class="logo-text">
            <h1 class="logo-title">Cijiu's Network Lab</h1>
            <p class="logo-subtitle">网络工程师手记</p>
          </div>
        </router-link>
      </div>

      <!-- 导航菜单（桌面端） -->
      <nav class="desktop-nav">
        <n-menu
          v-model:value="activeKey"
          mode="horizontal"
          :options="menuOptions"
          @update:value="handleMenuClick"
        />
      </nav>

      <!-- 右侧功能区 -->
      <div class="right-section">
        <!-- 登录按钮（未登录时显示） -->
        <n-button
          v-if="!blogStore.isLoggedIn"
          type="primary"
          size="small"
          @click="goToLogin"
          class="login-btn-header"
        >
          登录
        </n-button>

        <!-- 搜索框 -->
        <n-input
          v-model:value="searchQuery"
          placeholder="搜索技术文章..."
          class="search-input"
          clearable
          @keyup.enter="handleSearch"
        >
          <template #prefix>
            <n-icon :component="SearchOutline" />
          </template>
        </n-input>

        <!-- 主题切换按钮 -->
        <n-tooltip placement="bottom">
          <template #trigger>
            <n-button
              quaternary
              circle
              @click="toggleDarkMode"
              class="theme-toggle"
            >
              <template #icon>
                <n-icon :component="isDark ? SunnyOutline : MoonOutline" />
              </template>
            </n-button>
          </template>
          {{ isDark ? '切换到亮色模式' : '切换到暗黑模式' }}
        </n-tooltip>

        <!-- 社交链接 -->
        <div class="social-links">
          <n-tooltip placement="bottom">
            <template #trigger>
              <n-button quaternary circle @click="openGithub">
                <template #icon>
                  <n-icon :component="LogoGithub" />
                </template>
              </n-button>
            </template>
            GitHub
          </n-tooltip>
        </div>

        <!-- 登录用户信息 -->
        <n-dropdown v-if="blogStore.isLoggedIn" :options="userMenuOptions" @select="handleUserMenuSelect">
          <div class="user-profile">
            <div class="user-avatar">
              <img v-if="blogStore.currentUser === 'fwp@1234'" :src="fwpAvatar" alt="fwp" />
              <img v-else :src="`https://ui-avatars.com/api/?name=${blogStore.currentUser}&background=667eea&color=fff&size=64`" :alt="blogStore.currentUser" />
            </div>
            <span class="username">{{ blogStore.currentUser?.split('@')[0] || '用户' }}</span>
          </div>
        </n-dropdown>

        <!-- 移动端菜单按钮 -->
        <n-button
          quaternary
          class="mobile-menu-btn"
          @click="showMobileMenu = !showMobileMenu"
        >
          <template #icon>
            <n-icon :component="showMobileMenu ? CloseOutline : MenuOutline" />
          </template>
        </n-button>
      </div>
    </div>

    <!-- 移动端导航菜单 -->
    <transition name="slide-down">
      <div v-if="showMobileMenu" class="mobile-nav">
        <n-menu
          v-model:value="activeKey"
          mode="vertical"
          :options="menuOptions"
          @update:value="handleMenuClick"
        />
      </div>
    </transition>
  </header>
</template>

<script setup>
import { ref, computed, h, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useBlogStore } from '@/stores/blog'
import fwpAvatar from '@/assets/fwp-avatar.jpg'
import {
  SearchOutline,
  MoonOutline,
  SunnyOutline,
  LogoGithub,
  MenuOutline,
  CloseOutline,
  LogOutOutline
} from '@vicons/ionicons5'
import { NMenu, NInput, NButton, NIcon, NTooltip, NDropdown } from 'naive-ui'

const router = useRouter()
const blogStore = useBlogStore()

// 当前激活的菜单项
const activeKey = ref('home')

// 搜索关键词
const searchQuery = ref('')

// 移动端菜单显示状态
const showMobileMenu = ref(false)

// 暗黑模式
const isDark = computed(() => blogStore.darkMode)

// 路由和菜单键的映射关系
const routeKeyMap = {
  '/': 'home',
  '/articles': 'articles',
  '/articles/routing-switching': 'routing-switching',
  '/articles/security': 'security',
  '/articles/wireless': 'wireless',
  '/articles/datacenter': 'datacenter',
  '/notes': 'labs',
  '/resources': 'resources',
  '/about': 'about'
}

// 根据当前路由更新激活的菜单项
const updateActiveKey = () => {
  const path = router.currentRoute.value.path
  activeKey.value = routeKeyMap[path] || 'home'
}

// 监听路由变化
watch(() => router.currentRoute.value, updateActiveKey, { immediate: true })

// 切换暗黑模式
const toggleDarkMode = () => {
  blogStore.setDarkMode(!blogStore.darkMode)
}

// 渲染菜单标签，根据激活状态设置颜色
const renderLabel = (label, key) => {
  const isActive = activeKey.value === key
  return h('span', {
    style: {
      color: isActive ? '#66ff99' : '#ffffff',
      fontWeight: '600',
      fontSize: '15px',
      textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
      transition: 'all 0.3s ease',
      cursor: 'pointer'
    },
    onClick: (e) => {
      e.preventDefault()
      e.stopPropagation()
      console.log('菜单点击:', key)
      handleMenuClick(key, null)
    }
  }, label)
}

// 渲染图标函数
const renderIcon = (icon, size = '16px') => {
  return () => h(NIcon, null, {
    default: () => h('span', { style: { fontSize: size } }, icon)
  })
}

// 渲染子菜单图标
const renderSubmenuIcon = (icon) => {
  return () => h(NIcon, null, {
    default: () => h('span', { style: { fontSize: '14px' } }, icon)
  })
}

// 菜单选项配置
const menuOptions = computed(() => [
  {
    label: '首页',
    key: 'home',
    renderLabel: () => renderLabel('首页', 'home')
  },
  {
    label: '技术文章',
    key: 'articles',
    renderLabel: () => renderLabel('技术文章', 'articles'),
    children: [
      {
        label: '路由交换',
        key: 'routing-switching',
        renderLabel: () => renderLabel('路由交换', 'routing-switching')
      },
      {
        label: '网络安全',
        key: 'security',
        renderLabel: () => renderLabel('网络安全', 'security')
      },
      {
        label: '无线网络',
        key: 'wireless',
        renderLabel: () => renderLabel('无线网络', 'wireless')
      },
      {
        label: '数据中心',
        key: 'datacenter',
        renderLabel: () => renderLabel('数据中心', 'datacenter')
      }
    ]
  },
  {
    label: '实验笔记',
    key: 'labs',
    renderLabel: () => renderLabel('实验笔记', 'labs')
  },
  {
    label: '资源下载',
    key: 'resources',
    renderLabel: () => renderLabel('资源下载', 'resources')
  },
  {
    label: '关于我',
    key: 'about',
    renderLabel: () => renderLabel('关于我', 'about')
  }
])

// 用户菜单选项
const userMenuOptions = computed(() => [
  {
    label: '退出登录',
    key: 'logout',
    icon: () => h(NIcon, null, { default: () => h(LogOutOutline) })
  }
])

// 处理菜单点击
const handleMenuClick = (key, item) => {
  console.log('处理菜单点击:', key)
  const routeMap = {
    'home': '/',
    'articles': '/articles',
    'routing-switching': '/articles/routing-switching',
    'security': '/articles/security',
    'wireless': '/articles/wireless',
    'datacenter': '/articles/datacenter',
    'labs': '/notes',
    'resources': '/resources',
    'about': '/about'
  }

  console.log('路由映射:', routeMap[key])

  if (routeMap[key]) {
    console.log('准备跳转到:', routeMap[key])
    router.push(routeMap[key]).then(() => {
      console.log('跳转成功')
    }).catch(err => {
      console.error('跳转失败:', err)
    })
    showMobileMenu.value = false
  }
}

// 处理用户菜单点击
const handleUserMenuSelect = (key) => {
  if (key === 'logout') {
    handleLogout()
  }
}

// 处理搜索
const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({ path: '/search', query: { q: searchQuery.value } })
  }
}

// 打开 GitHub
const openGithub = () => {
  window.open('https://github.com/yourusername', '_blank')
}

// 处理退出登录
const handleLogout = () => {
  blogStore.logout()
  router.push('/login')
}

// 跳转到登录页
const goToLogin = () => {
  router.push('/login')
}

</script>

<style lang="less" scoped>
.site-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
  border-bottom: 3px solid #4a90e2;

  html.dark & {
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
    border-bottom-color: #2d5a8a;
  }
}

.header-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 72px;
}

.logo-section {
  flex-shrink: 0;
}

.logo-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  gap: 12px;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateX(4px);
  }
}

.logo-icon {
  font-size: 36px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.logo-text {
  display: flex;
  flex-direction: column;
}

.logo-title {
  font-size: 22px;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
  letter-spacing: 0.5px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.logo-subtitle {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.85);
  margin: 0;
  font-family: 'Courier New', Courier, monospace;
  letter-spacing: 1px;
}

.desktop-nav {
  flex: 1;
  display: flex;
  justify-content: center;
  margin: 0 24px;

  :deep(.n-menu) {
    .n-menu-item {
      .n-menu-item-content {
        &::before {
          border-left: 3px solid transparent;
          transition: all 0.3s ease;
        }

        &:hover::before {
          border-left-color: #4a90e2;
        }
      }
    }

    .n-submenu {
      .n-popover {
        .n-menu-item-content-header {
          color: #333 !important;
        }
      }
    }
  }
}

.right-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.login-btn-header {
  margin-right: 8px;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(-1px);
  }

  .user-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .n-icon {
      width: 100%;
      height: 100%;
      color: #ffffff;
    }
  }

  .username {
    font-size: 14px;
    color: #ffffff;
    font-weight: 600;
  }
}

html.dark .user-profile {
  background: rgba(255, 255, 255, 0.08);

  &:hover {
    background: rgba(255, 255, 255, 0.12);
  }

  .username {
    color: #fff;
  }
}

.search-input {
  width: 220px;
  transition: width 0.3s ease;

  &:focus-within {
    width: 280px;
  }

  :deep(.n-input) {
    background-color: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.3);

    .n-input__input-el {
      color: #ffffff;

      &::placeholder {
        color: rgba(255, 255, 255, 0.7);
      }
    }

    .n-input__prefix {
      color: rgba(255, 255, 255, 0.8);
    }
  }

  html.dark & {
    :deep(.n-input) {
      background-color: rgba(255, 255, 255, 0.08);
      border-color: rgba(255, 255, 255, 0.2);
    }
  }
}

.theme-toggle {
  color: #ffffff !important;

  :deep(.n-button__icon) {
    font-size: 20px;
  }
}

.social-links {
  display: flex;
  align-items: center;
  gap: 8px;

  .n-button {
    color: #ffffff !important;
  }
}

.mobile-menu-btn {
  display: none;
  color: #ffffff !important;
}

.mobile-nav {
  padding: 16px 24px;
  background: rgba(0, 0, 0, 0.2);
  border-top: 1px solid rgba(255, 255, 255, 0.1);

  :deep(.n-menu) {
    .n-menu-item {
      .n-menu-item-content-header {
        color: #ffffff !important;
      }
    }

    .n-menu-item--active {
      .n-menu-item-content-header {
        color: #66ff99 !important;
      }
    }
  }
}

// 响应式设计
@media (max-width: 1024px) {
  .desktop-nav {
    display: none;
  }

  .mobile-menu-btn {
    display: inline-flex;
  }

  .search-input {
    width: 160px;

    &:focus-within {
      width: 180px;
    }
  }
}

@media (max-width: 768px) {
  .header-container {
    padding: 0 16px;
    height: 64px;
  }

  .logo-title {
    font-size: 18px;
  }

  .logo-subtitle {
    font-size: 11px;
  }

  .search-input {
    display: none;
  }
}

// 下滑动画
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>