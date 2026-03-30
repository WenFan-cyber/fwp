<script setup>
import { useRouter } from 'vue-router'
import { useBlogStore } from '@/stores/blog'
import { ref, onMounted, onUnmounted } from 'vue'
import fwpAvatar from '@/assets/fwp-avatar.jpg'
import {
  PersonOutline,
  LocationOutline,
  BriefcaseOutline,
  PhonePortraitOutline,
  MailOutline
} from '@vicons/ionicons5'

const router = useRouter()
const blogStore = useBlogStore()

const containerHeight = ref(85)

const handleScroll = () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop
  const maxScroll = 500
  const scrollProgress = Math.min(scrollTop / maxScroll, 1)
  containerHeight.value = 85 - (scrollProgress * 34)
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <div class="home-container" :style="{ height: `${containerHeight}vh` }">
    <div class="profile-card">
      <div class="avatar-section">
        <div class="avatar">
          <img :src="fwpAvatar" alt="avatar" />
        </div>
      </div>

      <div class="info-section">
        <div class="name-row">
          <h1 class="name">樊文平</h1>
          <div class="hobbies">
            <span class="hobby-label">爱好：</span>
            <span class="hobby-item">编程</span>
            <span class="hobby-separator">|</span>
            <span class="hobby-item">阅读</span>
            <span class="hobby-separator">|</span>
            <span class="hobby-item">旅行</span>
          </div>
        </div>

        <div class="tags">
          <div class="tag">
            <n-icon :component="PersonOutline" />
            <span>男 | 22 岁</span>
          </div>
          <div class="tag">
            <n-icon :component="LocationOutline" />
            <span>襄阳</span>
          </div>
          <div class="tag">
            <n-icon :component="BriefcaseOutline" />
            <span>网络工程师</span>
          </div>
        </div>

        <div class="contact-row">
          <div class="contact-item">
            <n-icon :component="PhonePortraitOutline" />
            <span>电话：18371135435</span>
          </div>
          <div class="contact-item">
            <n-icon :component="MailOutline" />
            <span>邮箱：3177259219@qq.com</span>
          </div>
          <div class="contact-item">
            <n-icon :component="LocationOutline" />
            <span>期望城市：武汉</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-container {
  height: 85vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  background: linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%);
  transition: height 0.1s ease-out;
  margin: 0 auto;
}

.profile-card {
  max-width: 1000px;
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 48px;
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 48px;
  align-items: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin: 0 auto;
}

.avatar-section {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-left: 40px;
}

.avatar {
  width: 280px;
  height: 180px;
  border-radius: 12px;
  overflow: hidden;
  border: 4px solid rgba(0, 210, 255, 0.3);
  box-shadow: 0 0 40px rgba(0, 210, 255, 0.2);
  transition: all 0.3s ease;
}

.avatar:hover {
  border-color: rgba(0, 210, 255, 0.6);
  box-shadow: 0 0 60px rgba(0, 210, 255, 0.4);
  transform: scale(1.02);
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.info-section {
  color: #fff;
  text-align: center;
}

.name-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  margin-bottom: 32px;
  flex-wrap: wrap;
}

.tags {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 32px;
  justify-content: center;
}

.contact-row {
  display: flex;
  flex-direction: row;
  gap: 16px;
  margin-top: 24px;
  justify-content: center;
  text-align: center;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  color: rgba(255, 255, 255, 0.85);
  white-space: nowrap;
  justify-content: center;
}

.contact-item .n-icon {
  font-size: 20px;
  color: #00d2ff;
  width: 24px;
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .profile-card {
    grid-template-columns: 1fr;
    padding: 32px 24px;
    gap: 32px;
  }

  .avatar {
    width: 200px;
    height: 200px;
  }

  .name {
    font-size: 36px;
  }

  .contact-row {
    flex-direction: column;
    gap: 12px;
  }
}
</style>