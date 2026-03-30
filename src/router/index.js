import { createRouter, createWebHistory } from 'vue-router'
import { useBlogStore } from '@/stores/blog'

const routes = [
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/Login.vue')
    },
    {
        path: '/',
        name: 'Home',
        component: () => import('@/views/Home.vue'),
        meta: { requiresAuth: false }
    },
    {
        path: '/packet-tracer',
        name: 'PacketTracer',
        component: () => import('@/views/PacketTracer.vue'),
        meta: { requiresAuth: false }
    },
    {
        path: '/notes',
        name: 'Notes',
        component: () => import('@/views/Notes.vue'),
        meta: { requiresAuth: false }
    },
    {
        path: '/notes/:id',
        name: 'NoteDetail',
        component: () => import('@/views/NoteDetail.vue'),
        meta: { requiresAuth: false }
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    const blogStore = useBlogStore()
    
    // 如果未登录且访问的不是登录页，重定向到登录页
    if (!blogStore.isLoggedIn && to.path !== '/login') {
        next('/login')
    } else if (blogStore.isLoggedIn && to.path === '/login') {
        // 如果已登录且访问登录页，重定向到首页
        next('/')
    } else {
        next()
    }
})

export default router
