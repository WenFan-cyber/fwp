<template>
  <div class="note-detail-container">
    <div class="content-card">
      <!-- 返回按钮 -->
      <n-button @click="goBack" quaternary class="back-btn">
        <template #icon>
          <n-icon :component="ArrowBackOutline" />
        </template>
        返回列表
      </n-button>

      <!-- 笔记头部 -->
      <div class="note-header">
        <h1 class="note-title">{{ note.title }}</h1>
        <div class="note-meta">
          <n-tag :type="getCategoryType(note.category)">
            {{ getCategoryName(note.category) }}
          </n-tag>
          <span class="meta-item">
            <n-icon :component="CalendarOutline" />
            {{ note.date }}
          </span>
          <span class="meta-item">
            <n-icon :component="EyeOutline" />
            {{ note.views }}
          </span>
        </div>
      </div>

      <!-- 标签 -->
      <div class="tags-section">
        <n-tag
            v-for="tag in note.tags"
            :key="tag"
            size="small"
            type="info"
            round
        >
          {{ tag }}
        </n-tag>
      </div>

      <!-- 笔记摘要 -->
      <div class="excerpt-section">
        <p>{{ note.excerpt }}</p>
      </div>

      <!-- 详细内容 -->
      <div v-if="note.content" class="detail-content">
        <!-- SSH 配置 -->
        <div v-if="note.content.ssh" class="config-section">
          <h2 class="section-title">
            <n-icon :component="ShieldCheckmarkOutline" color="#4a90e2" />
            {{ note.content.ssh.title }}
          </h2>
          <p class="section-desc">{{ note.content.ssh.description }}</p>

          <div class="code-block">
            <div class="code-header">
              <span class="code-title">SSH 配置命令</span>
              <n-button size="small" @click="copyCode(note.content.ssh.config)">
                <template #icon>
                  <n-icon :component="CopyOutline" />
                </template>
                复制
              </n-button>
            </div>
            <pre><code class="language-bash">{{ note.content.ssh.config }}</code></pre>
          </div>

          <div class="notes-list">
            <h3>配置要点：</h3>
            <ul>
              <li v-for="(note, index) in note.content.ssh.notes" :key="index">
                {{ note }}
              </li>
            </ul>
          </div>
        </div>

        <!-- Telnet 配置 -->
        <div v-if="note.content.telnet" class="config-section">
          <h2 class="section-title">
            <n-icon :component="ConstructOutline" color="#ff9800" />
            {{ note.content.telnet.title }}
          </h2>
          <p class="section-desc">{{ note.content.telnet.description }}</p>

          <div class="code-block">
            <div class="code-header">
              <span class="code-title">Telnet 配置命令</span>
              <n-button size="small" @click="copyCode(note.content.telnet.config)">
                <template #icon>
                  <n-icon :component="CopyOutline" />
                </template>
                复制
              </n-button>
            </div>
            <pre><code class="language-bash">{{ note.content.telnet.config }}</code></pre>
          </div>

          <div class="notes-list">
            <h3>配置要点：</h3>
            <ul>
              <li v-for="(note, index) in note.content.telnet.notes" :key="index">
                {{ note }}
              </li>
            </ul>
          </div>
        </div>

        <!-- SSH vs Telnet 对比 -->
        <div v-if="note.content.comparison" class="comparison-section">
          <h2 class="section-title">
            <n-icon :component="GitCompareOutline" color="#9c27b0" />
            SSH vs Telnet 对比
          </h2>

          <n-data-table
              :columns="comparisonColumns"
              :data="note.content.comparison"
              :bordered="false"
              size="small"
              class="comparison-table"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, h } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useMessage } from 'naive-ui'
import {
  ArrowBackOutline,
  CalendarOutline,
  EyeOutline,
  ShieldCheckmarkOutline,
  ConstructOutline,
  CopyOutline,
  GitCompareOutline,
  BookOutline,
  WifiOutline,
  ServerOutline,
  CodeSlashOutline,
  BulbOutline
} from '@vicons/ionicons5'
import { NButton, NIcon, NTag, NDataTable } from 'naive-ui'

const router = useRouter()
const route = useRoute()
const message = useMessage()

// 笔记数据
const notesData = ref([
  {
    id: 1,
    title: '华为设备 BFD 配置详解',
    excerpt: '双向转发检测（BFD）是一种快速故障检测机制，能够在毫秒级别内检测到链路故障...',
    category: 'routing-switching',
    date: '2026-03-28',
    views: 1256,
    tags: ['BFD', '华为', '高可用性']
  },
  {
    id: 2,
    title: 'OSPF 多区域配置实践',
    excerpt: 'OSPF 协议是企业网络中最常用的内部网关协议，本文将详细介绍 OSPF 多区域配置...',
    category: 'routing-switching',
    date: '2026-03-25',
    views: 892,
    tags: ['OSPF', '路由协议', '多区域']
  },
  {
    id: 3,
    title: '防火墙安全策略部署指南',
    excerpt: '企业网络安全防护中，防火墙是最基础也是最重要的安全设备...',
    category: 'security',
    date: '2026-03-22',
    views: 1534,
    tags: ['防火墙', '安全策略', 'ACL']
  },
  {
    id: 4,
    title: '企业 WLAN 规划与部署',
    excerpt: '无线网络在企业网络中的应用越来越广泛，如何进行合理的 WLAN 规划...',
    category: 'wireless',
    date: '2026-03-20',
    views: 745,
    tags: ['WLAN', '无线', 'AC+AP']
  },
  {
    id: 5,
    title: '数据中心 Spine-Leaf 架构设计',
    excerpt: '传统三层架构已经无法满足现代数据中心的需求，Spine-Leaf 架构应运而生...',
    category: 'datacenter',
    date: '2026-03-18',
    views: 1089,
    tags: ['数据中心', 'Spine-Leaf', '架构设计']
  },
  {
    id: 6,
    title: 'TeamViewer 远程协助配置指南',
    excerpt: 'TeamViewer 是最常用的远程协助工具之一，本文介绍其高级配置和使用技巧...',
    category: 'remote',
    date: '2026-03-16',
    views: 1876,
    tags: ['TeamViewer', '远程协助', '配置']
  },
  {
    id: 7,
    title: 'Windows 远程桌面 (RDP) 深度使用',
    excerpt: 'Windows 远程桌面协议 (RDP) 的详细配置，包括多用户、端口转发等高级功能...',
    category: 'remote',
    date: '2026-03-14',
    views: 2345,
    tags: ['RDP', 'Windows', '远程桌面']
  },
  {
    id: 8,
    title: 'SSH 远程连接与端口转发',
    excerpt: 'SSH 不仅是安全的远程登录工具，还支持多种端口转发模式，实现安全的远程访问。本文详细介绍华为设备的 SSH 和 Telnet 配置...',
    category: 'remote',
    date: '2026-03-12',
    views: 1987,
    tags: ['SSH', '端口转发', 'Linux', 'Telnet', '华为'],
    content: {
      ssh: {
        title: 'SSH 配置',
        description: 'SSH (Secure Shell) 是一种加密的网络传输协议，可在不安全的网络中为网络服务提供安全的传输环境。',
        config: `# 创建本地用户并设置密码
local-user admin password cipher -J&7(SW'E2AI>,Z,88J\\:Q!!
local-user admin privilege level 15
local-user admin service-type ssh

# 启用 Stelnet 服务器
stelnet server enable

# 设置 SSH 认证类型为密码认证
ssh authentication-type default password

# 配置 Console 口和 VTY 用户界面
user-interface con 0
user-interface vty 0 4
 authentication-mode aaa
 protocol inbound ssh

# 设备登录密码配置
user-interface con 0
 authentication-mode password
 set authentication password cipher N<{9C'-H>Mq>l=&#UQ@OMS:#
user-interface vty 0 4

return`,
        notes: [
          'SSH 使用加密传输，安全性高',
          '默认端口：22',
          '支持密码认证和密钥认证',
          '推荐使用密钥认证提高安全性'
        ]
      },
      telnet: {
        title: 'Telnet 配置',
        description: 'Telnet 是一种应用层协议，用于在 Internet 或局域网上提供双向的、面向文本的通信设施。',
        config: `# 创建本地用户并设置密码
local-user admin password cipher -J&7(SW'E2AI>,Z,88J\\:Q!!
local-user admin privilege level 15
local-user admin service-type telnet

# 启用 Telnet 服务器
telnet server enable

# 配置 Console 口和 VTY 用户界面
user-interface con 0
user-interface vty 0 4
 authentication-mode aaa
 protocol inbound telnet

# 设备登录密码配置
user-interface con 0
 authentication-mode password
 set authentication password cipher N<{9C'-H>Mq>l=&#UQ@OMS:#
user-interface vty 0 4

return`,
        notes: [
          'Telnet 使用明文传输，安全性低',
          '默认端口：23',
          '仅建议在内部测试环境使用',
          '生产环境强烈建议使用 SSH'
        ]
      },
      comparison: [
        { item: '安全性', ssh: '加密传输，安全', telnet: '明文传输，不安全' },
        { item: '端口', ssh: '22', telnet: '23' },
        { item: '性能', ssh: '加解密消耗 CPU', telnet: '无加密开销' },
        { item: '推荐场景', ssh: '生产环境、外网', telnet: '内网测试、调试' }
      ]
    }
  },
  {
    id: 9,
    title: 'Python 网络自动化入门',
    excerpt: '使用 Python 进行网络设备自动化配置，提高运维效率...',
    category: 'automation',
    date: '2026-03-15',
    views: 2103,
    tags: ['Python', '自动化', 'Netmiko']
  },
  {
    id: 10,
    title: '大型园区网项目实战总结',
    excerpt: '某大型企业园区网络建设项目，从需求分析到实施方案的全流程记录...',
    category: 'projects',
    date: '2026-03-10',
    views: 3256,
    tags: ['项目实战', '园区网', '案例分享']
  }
])

// 查找当前笔记
const note = computed(() => {
  const noteId = parseInt(route.params.id)
  return notesData.value.find(n => n.id === noteId) || {}
})

// 对比表格列
const comparisonColumns = [
  {
    title: '对比项',
    key: 'item',
    width: 150,
    render: (row) => h('strong', { style: { color: '#4a90e2' } }, row.item)
  },
  {
    title: 'SSH',
    key: 'ssh',
    render: (row) => h('span', { style: { color: '#4caf50' } }, row.ssh)
  },
  {
    title: 'Telnet',
    key: 'telnet',
    render: (row) => h('span', { style: { color: '#ff9800' } }, row.telnet)
  }
]

// 返回上一页
const goBack = () => {
  router.back()
}

// 获取分类类型
const getCategoryType = (category) => {
  const typeMap = {
    'routing-switching': 'primary',
    'security': 'error',
    'wireless': 'success',
    'datacenter': 'warning',
    'remote': 'info',
    'automation': 'success',
    'projects': 'default'
  }
  return typeMap[category] || 'default'
}

// 获取分类名称
const getCategoryName = (category) => {
  const nameMap = {
    'routing-switching': '路由交换',
    'security': '网络安全',
    'wireless': '无线网络',
    'datacenter': '数据中心',
    'remote': '远程技术',
    'automation': '自动化运维',
    'projects': '项目实战'
  }
  return nameMap[category] || category
}

// 复制代码
const copyCode = (code) => {
  navigator.clipboard.writeText(code)
  message.success('代码已复制到剪贴板')
}
</script>

<style scoped>
.note-detail-container {
  min-height: calc(100vh - 200px);
  background: linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%);
  padding: 24px;
}

.content-card {
  max-width: 1200px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 40px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.back-btn {
  margin-bottom: 24px;
  color: #fff;
}

.note-header {
  margin-bottom: 32px;
}

.note-title {
  color: #fff;
  font-size: 32px;
  font-weight: 600;
  margin: 0 0 16px 0;
}

.note-meta {
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
}

.meta-item .n-icon {
  color: #4a90e2;
}

.tags-section {
  display: flex;
  gap: 8px;
  margin-bottom: 32px;
  flex-wrap: wrap;
}

.excerpt-section {
  padding: 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border-left: 4px solid #4a90e2;
  margin-bottom: 40px;
}

.excerpt-section p {
  color: rgba(255, 255, 255, 0.8);
  font-size: 15px;
  line-height: 1.8;
  margin: 0;
}

.detail-content {
  color: #fff;
}

.config-section {
  margin-bottom: 40px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 16px 0;
  color: #fff;
}

.section-desc {
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  line-height: 1.8;
  margin: 0 0 24px 0;
}

.code-block {
  background: rgba(0, 0, 0, 0.4);
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.code-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.05);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.code-title {
  color: #4a90e2;
  font-weight: 600;
  font-size: 14px;
}

.code-block pre {
  margin: 0;
  padding: 20px;
  overflow-x: auto;
}

.code-block code {
  color: #a8ff78;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 13px;
  line-height: 1.8;
  white-space: pre;
}

.notes-list {
  background: rgba(255, 255, 255, 0.05);
  padding: 20px;
  border-radius: 8px;
}

.notes-list h3 {
  color: #4a90e2;
  font-size: 16px;
  margin: 0 0 12px 0;
}

.notes-list ul {
  margin: 0;
  padding-left: 20px;
}

.notes-list li {
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  line-height: 2;
}

.comparison-section {
  margin-top: 40px;
}

.comparison-table {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  overflow: hidden;
}

@media (max-width: 768px) {
  .content-card {
    padding: 24px;
  }

  .note-title {
    font-size: 24px;
  }

  .section-title {
    font-size: 20px;
  }
}
</style>
