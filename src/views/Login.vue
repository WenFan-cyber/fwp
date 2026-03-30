<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { NForm, NFormItem, NInput, NButton, NCard } from 'naive-ui'
import { useMessage } from 'naive-ui'
import { useBlogStore } from '@/stores/blog'

const router = useRouter()
const message = useMessage()
const blogStore = useBlogStore()

const loginForm = ref({
  username: '',
  password: ''
})

const loading = ref(false)

const validateLogin = (username, password) => {
  const validUsers = {
    'fwp@1234': 'admin@1234',
    'wsy@1234': 'admin@1234'
  }

  return validUsers[username] === password
}

const handleLogin = async () => {
  if (!loginForm.value.username) {
    message.error('请输入账号')
    return
  }

  if (!loginForm.value.password) {
    message.error('请输入密码')
    return
  }

  loading.value = true

  setTimeout(() => {
    if (validateLogin(loginForm.value.username, loginForm.value.password)) {
      blogStore.login(loginForm.value.username)
      message.success('登录成功')
      router.push('/')
    } else {
      message.error('账号或密码错误')
    }
    loading.value = false
  }, 500)
}
</script>

<template>
  <div class="login-container">
    <div class="login-card-wrapper">
      <n-card :bordered="false" class="login-card">
        <div class="login-header">
          <div class="logo-icon">🌐</div>
          <h1>FWP's Network Lab</h1>
          <p>网络工程师手记 - 登录</p>
        </div>

        <n-form :model="loginForm" size="large" label-placement="top">
          <n-form-item label="账号" label-style="font-weight: 500; font-size: 14px; color: #555; margin-bottom: 8px;">
            <n-input
                v-model:value="loginForm.username"
                placeholder="请输入账号"
                clearable
                class="login-input"
            />
          </n-form-item>

          <n-form-item label="密码" label-style="font-weight: 500; font-size: 14px; color: #555; margin-bottom: 8px;">
            <n-input
                v-model:value="loginForm.password"
                type="password"
                placeholder="请输入密码"
                show-password-on="click"
                class="login-input"
            />
          </n-form-item>

          <n-form-item>
            <n-button
                type="primary"
                size="large"
                block
                :loading="loading"
                @click="handleLogin"
                class="login-btn"
            >
              登录
            </n-button>
          </n-form-item>
        </n-form>

        <div class="login-tips">
          <p>测试账号：</p>
          <div class="account-list">
            <span>fwp@1234 / admin@1234</span>
            <span>wsy@1234 / admin@1234</span>
          </div>
        </div>
      </n-card>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(245, 247, 250, 0.7) 0%, rgba(235, 238, 242, 0.7) 100%);
  padding: 20px;
  position: relative;
  backdrop-filter: blur(10px);
}

.login-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image:
      radial-gradient(circle at 30% 40%, rgba(74, 144, 226, 0.02) 0%, transparent 35%),
      radial-gradient(circle at 70% 60%, rgba(102, 126, 234, 0.02) 0%, transparent 35%);
}

.login-card-wrapper {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 440px;
  animation: slideUp 0.6s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.login-card {
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
  background: rgba(255, 255, 255, 0.98);
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.04);
}

.login-header {
  text-align: center;
  margin-bottom: 32px;
  padding: 32px 24px 0;
}

.logo-icon {
  font-size: 48px;
  margin-bottom: 16px;
  display: inline-block;
  animation: gentleFloat 3s ease-in-out infinite;
}

@keyframes gentleFloat {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-6px);
  }
}

.login-header h1 {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 8px 0;
  letter-spacing: 0.3px;
}

.login-header p {
  font-size: 13px;
  color: #999;
  margin: 0;
}

.login-input :deep(.n-input) {
  height: 44px;
  border-radius: 8px;
  transition: all 0.2s ease;
  background-color: rgba(0, 0, 0, 0.02);
  border-color: transparent;
}

.login-input :deep(.n-input .n-input__input-el) {
  font-size: 14px;
  color: #333;
  padding: 0 12px;
}

.login-input :deep(.n-input:hover) {
  background-color: rgba(0, 0, 0, 0.04);
}

.login-input :deep(.n-input--focused) {
  background-color: rgba(0, 0, 0, 0.03);
  box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.12);
}

.login-btn {
  height: 44px;
  font-size: 15px;
  font-weight: 500;
  border-radius: 8px;
  background: linear-gradient(135deg, #4a90e2 0%, #5aa0f2 100%);
  transition: all 0.3s ease;
}

.login-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(74, 144, 226, 0.3);
}

.login-btn:active {
  transform: translateY(0);
}

.login-tips {
  margin-top: 24px;
  padding: 18px;
  background: linear-gradient(135deg, rgba(74, 144, 226, 0.03) 0%, rgba(102, 126, 234, 0.03) 100%);
  border-radius: 12px;
  text-align: center;
  border: 1px solid rgba(74, 144, 226, 0.06);
}

.login-tips p {
  font-size: 13px;
  color: #666;
  margin: 0 0 10px 0;
  font-weight: 500;
}

.account-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.account-list span {
  font-size: 12px;
  color: #4a90e2;
  font-family: 'Courier New', Courier, monospace;
  background: rgba(255, 255, 255, 0.7);
  padding: 6px 12px;
  border-radius: 6px;
  display: block;
  border: 1px solid rgba(74, 144, 226, 0.1);
  transition: all 0.2s ease;
}

.account-list span:hover {
  background: rgba(74, 144, 226, 0.06);
  border-color: rgba(74, 144, 226, 0.2);
  transform: translateX(4px);
}

html.dark .login-container {
  background: linear-gradient(135deg, rgba(26, 26, 46, 0.5) 0%, rgba(22, 33, 62, 0.5) 100%);
}

html.dark .login-container::before {
  background-image:
      radial-gradient(circle at 30% 40%, rgba(74, 144, 226, 0.04) 0%, transparent 35%),
      radial-gradient(circle at 70% 60%, rgba(102, 126, 234, 0.04) 0%, transparent 35%);
}

html.dark .login-card {
  background: rgba(30, 30, 40, 0.9);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15);
  border-color: rgba(255, 255, 255, 0.06);
}

html.dark .login-header h1 {
  color: #fff;
}

html.dark .login-header p {
  color: #aaa;
}

html.dark .login-tips {
  background: linear-gradient(135deg, rgba(74, 144, 226, 0.06) 0%, rgba(102, 126, 234, 0.06) 100%);
  border-color: rgba(74, 144, 226, 0.1);
}

html.dark .login-tips p {
  color: #bbb;
}

html.dark .account-list span {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(74, 144, 226, 0.2);
  color: #64b0ff;
}

html.dark .login-input :deep(.n-input) {
  background-color: rgba(255, 255, 255, 0.05);
  border-color: transparent;
}

html.dark .login-input :deep(.n-input:hover) {
  background-color: rgba(255, 255, 255, 0.07);
}

html.dark .login-input :deep(.n-input--focused) {
  background-color: rgba(255, 255, 255, 0.06);
  box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
}

html.dark .login-input :deep(.n-input .n-input__input-el) {
  color: #fff;
}
</style>
