import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useBlogStore = defineStore('blog', () => {
  const darkMode = ref(true)
  const isLoggedIn = ref(false)
  const currentUser = ref(null)

  // 从 localStorage 恢复登录状态
  const savedUser = localStorage.getItem('currentUser')
  const savedLoginStatus = localStorage.getItem('isLoggedIn')
  
  if (savedUser && savedLoginStatus === 'true') {
    currentUser.value = savedUser
    isLoggedIn.value = true
  }

  function setDarkMode(value) {
    darkMode.value = value
  }

  function login(username) {
    isLoggedIn.value = true
    currentUser.value = username
    localStorage.setItem('isLoggedIn', 'true')
    localStorage.setItem('currentUser', username)
  }

  function logout() {
    isLoggedIn.value = false
    currentUser.value = null
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('currentUser')
  }

  return {
    darkMode,
    isLoggedIn,
    currentUser,
    setDarkMode,
    login,
    logout
  }
})
