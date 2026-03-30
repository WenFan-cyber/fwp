<template>
  <div class="notes-container">
    <!-- 左侧技术目录 -->
    <aside class="sidebar">
      <div class="sidebar-content">
        <h2 class="sidebar-title">技术分类</h2>

        <n-menu
            v-model:value="activeCategory"
            mode="vertical"
            :options="categoryMenuOptions"
            @update:value="handleCategoryClick"
            class="category-menu"
        />

        <div class="tags-section">
          <h3 class="tags-title">热门标签</h3>
          <div class="tags-list">
            <n-tag
                v-for="tag in hotTags"
                :key="tag.name"
                :type="tag.type"
                size="small"
                round
                clickable
                @click="filterByTag(tag.name)"
            >
              {{ tag.name }}
            </n-tag>
          </div>
        </div>
      </div>
    </aside>

    <!-- 右侧内容区 -->
    <main class="notes-main">
      <div class="content-card">
        <!-- 笔记详情视图 -->
        <div v-if="currentNote" class="note-detail-view">
          <!-- 返回按钮 -->
          <n-button @click="goBackToList" quaternary class="back-btn">
            <template #icon>
              <n-icon :component="ArrowBackOutline" />
            </template>
            返回列表
          </n-button>

          <!-- 笔记头部 -->
          <div class="note-header">
            <h1 class="note-title">{{ currentNote.title }}</h1>
            <div class="note-meta">
              <n-tag :type="getCategoryType(currentNote.category)">
                {{ getCategoryName(currentNote.category) }}
              </n-tag>
              <span class="meta-item">
                <n-icon :component="CalendarOutline" />
                {{ currentNote.date }}
              </span>
              <span class="meta-item">
                <n-icon :component="EyeOutline" />
                {{ currentNote.views }}
              </span>
            </div>
          </div>

          <!-- 标签 -->
          <div class="tags-section">
            <n-tag
              v-for="tag in currentNote.tags"
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
            <p>{{ currentNote.excerpt }}</p>
          </div>

          <!-- 详细内容 -->
          <div v-if="currentNote.content" class="detail-content">
            <!-- SSH 配置 -->
            <div v-if="currentNote.content.ssh" class="config-section">
              <h2 class="section-title">
                <n-icon :component="ShieldCheckmarkOutline" color="#4a90e2" />
                {{ currentNote.content.ssh.title }}
              </h2>
              <p class="section-desc">{{ currentNote.content.ssh.description }}</p>

              <div class="code-block">
                <div class="code-header">
                  <span class="code-title">SSH 配置命令</span>
                  <n-button size="small" @click="copyCode(currentNote.content.ssh.config)">
                    <template #icon>
                      <n-icon :component="CopyOutline" />
                    </template>
                    复制
                  </n-button>
                </div>
                <pre><code class="language-bash">{{ currentNote.content.ssh.config }}</code></pre>
              </div>

              <div class="notes-list">
                <h3><n-icon :component="BulbOutline" /> 配置要点：</h3>
                <ul>
                  <li v-for="(note, index) in currentNote.content.ssh.notes" :key="index">
                    {{ note }}
                  </li>
                </ul>
              </div>

              <div class="tips-list">
                <h3><n-icon :component="RocketOutline" /> 最佳实践：</h3>
                <ul>
                  <li v-for="(tip, index) in currentNote.content.ssh.tips" :key="index">
                    {{ tip }}
                  </li>
                </ul>
              </div>
            </div>

            <!-- Telnet 配置 -->
            <div v-if="currentNote.content.telnet" class="config-section">
              <h2 class="section-title">
                <n-icon :component="ConstructOutline" color="#ff9800" />
                {{ currentNote.content.telnet.title }}
              </h2>
              <p class="section-desc">{{ currentNote.content.telnet.description }}</p>

              <div class="code-block">
                <div class="code-header">
                  <span class="code-title">Telnet 配置命令</span>
                  <n-button size="small" @click="copyCode(currentNote.content.telnet.config)">
                    <template #icon>
                      <n-icon :component="CopyOutline" />
                    </template>
                    复制
                  </n-button>
                </div>
                <pre><code class="language-bash">{{ currentNote.content.telnet.config }}</code></pre>
              </div>

              <div class="notes-list">
                <h3><n-icon :component="BulbOutline" /> 配置要点：</h3>
                <ul>
                  <li v-for="(note, index) in currentNote.content.telnet.notes" :key="index">
                    {{ note }}
                  </li>
                </ul>
              </div>

              <div class="tips-list">
                <h3><n-icon :component="RocketOutline" /> 使用建议：</h3>
                <ul>
                  <li v-for="(tip, index) in currentNote.content.telnet.tips" :key="index">
                    {{ tip }}
                  </li>
                </ul>
              </div>
            </div>

            <!-- SSH vs Telnet 对比 -->
            <div v-if="currentNote.content.comparison" class="comparison-section">
              <h2 class="section-title">
                <n-icon :component="GitCompareOutline" color="#9c27b0" />
                SSH vs Telnet 对比
              </h2>

              <n-data-table
                :columns="comparisonColumns"
                :data="currentNote.content.comparison"
                :bordered="false"
                size="small"
                class="comparison-table"
              />
            </div>

            <!-- SSH 端口转发 -->
            <div v-if="currentNote.content.portForwarding" class="config-section">
              <h2 class="section-title">
                <n-icon :component="ShareOutline" color="#00bcd4" />
                {{ currentNote.content.portForwarding.title }}
              </h2>
              <p class="section-desc">{{ currentNote.content.portForwarding.description }}</p>

              <div class="forwarding-types">
                <div v-for="type in currentNote.content.portForwarding.types" :key="type.name" class="forwarding-type">
                  <h3>{{ type.name }}</h3>
                  <p class="type-desc">{{ type.description }}</p>
                  <div class="code-snippet">
                    <div class="snippet-title">命令语法：</div>
                    <code>{{ type.syntax }}</code>
                  </div>
                  <div class="code-snippet">
                    <div class="snippet-title">示例：</div>
                    <code>{{ type.example }}</code>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 笔记列表视图 -->
        <div v-else>
          <!-- 顶部筛选栏 -->
          <div class="filter-bar">
            <n-input
                v-model:value="searchQuery"
                placeholder="搜索实验笔记..."
                clearable
                class="search-input"
                @keyup.enter="handleSearch"
            >
              <template #prefix>
                <n-icon :component="SearchOutline" />
              </template>
            </n-input>

            <n-select
                v-model:value="sortBy"
                :options="sortOptions"
                class="sort-select"
                @update:value="handleSortChange"
            />
          </div>

          <!-- 笔记列表 -->
          <div class="notes-list">
            <div
                v-for="note in filteredNotes"
                :key="note.id"
                class="note-card"
                @click="viewNote(note.id)"
            >
              <div class="note-header">
                <h3 class="note-title">{{ note.title }}</h3>
                <n-tag :type="getCategoryType(note.category)" size="small">
                  {{ getCategoryName(note.category) }}
                </n-tag>
              </div>

              <p class="note-excerpt">{{ note.excerpt }}</p>

              <div class="note-footer">
                <div class="note-meta">
                  <span class="note-date">
                    <n-icon :component="CalendarOutline" />
                    {{ note.date }}
                  </span>
                  <span class="note-views">
                    <n-icon :component="EyeOutline" />
                    {{ note.views }}
                  </span>
                </div>
                <div class="note-tags">
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
              </div>
            </div>
          </div>

          <!-- 空状态 -->
          <n-empty
              v-if="filteredNotes.length === 0"
              description="暂无相关实验笔记"
              size="large"
              class="empty-state"
          />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, h } from 'vue'
import { useRouter } from 'vue-router'
import { useMessage } from 'naive-ui'
import {
  SearchOutline,
  CalendarOutline,
  EyeOutline,
  BookOutline,
  ConstructOutline,
  WifiOutline,
  ShieldCheckmarkOutline,
  ServerOutline,
  CodeSlashOutline,
  BulbOutline,
  DesktopOutline,
  ArrowBackOutline,
  CopyOutline,
  GitCompareOutline,
  ShareOutline,
  RocketOutline
} from '@vicons/ionicons5'
import { NButton, NIcon, NTag, NDataTable, NEmpty, NInput, NSelect, NMenu } from 'naive-ui'

const router = useRouter()
const message = useMessage()

// 当前激活的分类
const activeCategory = ref('all')

// 搜索关键词
const searchQuery = ref('')

// 排序方式
const sortBy = ref('latest')

// 当前查看的笔记详情
const currentNote = ref(null)

// 分类菜单选项
const categoryMenuOptions = [
  {
    label: '全部笔记',
    key: 'all',
    icon: () => h(NIcon, null, { default: () => h(BookOutline) })
  },
  {
    label: '路由交换',
    key: 'routing-switching',
    icon: () => h(NIcon, null, { default: () => h(ConstructOutline) }),
    children: [
      {
        label: 'BFD 配置',
        key: 'routing-bfd'
      },
      {
        label: 'OSPF 协议',
        key: 'routing-ospf'
      },
      {
        label: 'BGP 配置',
        key: 'routing-bgp'
      },
      {
        label: 'VLAN 划分',
        key: 'switching-vlan'
      },
      {
        label: 'STP/RSTP',
        key: 'switching-stp'
      }
    ]
  },
  {
    label: '网络安全',
    key: 'security',
    icon: () => h(NIcon, null, { default: () => h(ShieldCheckmarkOutline) }),
    children: [
      {
        label: '防火墙策略',
        key: 'security-firewall'
      },
      {
        label: 'ACL 访问控制',
        key: 'security-acl'
      },
      {
        label: 'NAT 配置',
        key: 'security-nat'
      },
      {
        label: '端口安全',
        key: 'security-port'
      }
    ]
  },
  {
    label: '无线网络',
    key: 'wireless',
    icon: () => h(NIcon, null, { default: () => h(WifiOutline) }),
    children: [
      {
        label: 'WLAN 基础',
        key: 'wireless-basic'
      },
      {
        label: 'AC+AP 配置',
        key: 'wireless-acap'
      },
      {
        label: '无线优化',
        key: 'wireless-optimization'
      },
      {
        label: '无线安全',
        key: 'wireless-security'
      }
    ]
  },
  {
    label: '数据中心',
    key: 'datacenter',
    icon: () => h(NIcon, null, { default: () => h(ServerOutline) }),
    children: [
      {
        label: 'Spine-Leaf 架构',
        key: 'datacenter-spineleaf'
      },
      {
        label: '虚拟化技术',
        key: 'datacenter-virtualization'
      },
      {
        label: '存储网络',
        key: 'datacenter-storage'
      },
      {
        label: '负载均衡',
        key: 'datacenter-lb'
      }
    ]
  },
  {
    label: '远程技术',
    key: 'remote',
    icon: () => h(NIcon, null, { default: () => h(DesktopOutline) }),
    children: [
      {
        label: 'SSH 配置',
        key: 'remote-ssh'
      },
      {
        label: 'Telnet 配置',
        key: 'remote-telnet'
      },
      {
        label: 'RDP 远程桌面',
        key: 'remote-rdp'
      },
      {
        label: 'TeamViewer',
        key: 'remote-teamviewer'
      },
      {
        label: '端口转发',
        key: 'remote-forwarding'
      }
    ]
  },
  {
    label: '自动化运维',
    key: 'automation',
    icon: () => h(NIcon, null, { default: () => h(CodeSlashOutline) }),
    children: [
      {
        label: 'Python 脚本',
        key: 'automation-python'
      },
      {
        label: 'Ansible',
        key: 'automation-ansible'
      },
      {
        label: 'NETCONF/YANG',
        key: 'automation-netconf'
      },
      {
        label: 'API 集成',
        key: 'automation-api'
      }
    ]
  },
  {
    label: '项目实战',
    key: 'projects',
    icon: () => h(NIcon, null, { default: () => h(BulbOutline) }),
    children: [
      {
        label: '园区网项目',
        key: 'projects-campus'
      },
      {
        label: '数据中心项目',
        key: 'projects-datacenter'
      },
      {
        label: '无线覆盖项目',
        key: 'projects-wireless'
      },
      {
        label: '安全加固项目',
        key: 'projects-security'
      }
    ]
  }
]

// 热门标签
const hotTags = [
  { name: 'BFD', type: 'primary' },
  { name: 'OSPF', type: 'success' },
  { name: 'BGP', type: 'warning' },
  { name: 'VLAN', type: 'error' },
  { name: 'ACL', type: 'info' },
  { name: 'NAT', type: 'primary' },
  { name: '防火墙', type: 'danger' },
  { name: 'WLAN', type: 'success' }
]

// 排序选项
const sortOptions = [
  { label: '最新发布', value: 'latest' },
  { label: '最多浏览', value: 'views' },
  { label: '最早发布', value: 'oldest' }
]

// 模拟笔记数据
const notesData = ref([
  {
    id: 1,
    title: '华为设备 BFD 配置详解',
    excerpt: '双向转发检测（BFD）是一种快速故障检测机制，能够在毫秒级别内检测到链路故障...',
    category: 'routing-bfd',
    parentCategory: 'routing-switching',
    date: '2026-03-28',
    views: 1256,
    tags: ['BFD', '华为', '高可用性']
  },
  {
    id: 2,
    title: 'OSPF 多区域配置实践',
    excerpt: 'OSPF 协议是企业网络中最常用的内部网关协议，本文将详细介绍 OSPF 多区域配置...',
    category: 'routing-ospf',
    parentCategory: 'routing-switching',
    date: '2026-03-25',
    views: 892,
    tags: ['OSPF', '路由协议', '多区域']
  },
  {
    id: 3,
    title: 'BGP 路由反射器配置',
    excerpt: 'BGP 路由反射器用于解决 IBGP 全互联问题，本文详细介绍其原理和配置...',
    category: 'routing-bgp',
    parentCategory: 'routing-switching',
    date: '2026-03-23',
    views: 1045,
    tags: ['BGP', '路由反射器', 'IBGP']
  },
  {
    id: 4,
    title: 'VLAN 划分与 Inter-VLAN 路由',
    excerpt: 'VLAN 技术用于隔离广播域，本文介绍 VLAN 划分原则和跨 VLAN 通信配置...',
    category: 'switching-vlan',
    parentCategory: 'routing-switching',
    date: '2026-03-21',
    views: 1567,
    tags: ['VLAN', 'Trunk', '单臂路由']
  },
  {
    id: 5,
    title: '防火墙安全策略部署指南',
    excerpt: '企业网络安全防护中，防火墙是最基础也是最重要的安全设备...',
    category: 'security-firewall',
    parentCategory: 'security',
    date: '2026-03-22',
    views: 1534,
    tags: ['防火墙', '安全策略', 'ACL']
  },
  {
    id: 6,
    title: 'ACL 访问控制列表详解',
    excerpt: 'ACL 用于控制网络流量，本文详细介绍标准 ACL、扩展 ACL 的配置和应用...',
    category: 'security-acl',
    parentCategory: 'security',
    date: '2026-03-20',
    views: 987,
    tags: ['ACL', '访问控制', '流量过滤']
  },
  {
    id: 7,
    title: 'NAT 地址转换配置指南',
    excerpt: 'NAT 技术用于私有地址和公有地址转换，本文介绍静态 NAT、动态 NAT、PAT 配置...',
    category: 'security-nat',
    parentCategory: 'security',
    date: '2026-03-19',
    views: 1234,
    tags: ['NAT', 'PAT', '地址转换']
  },
  {
    id: 8,
    title: '企业 WLAN 规划与部署',
    excerpt: '无线网络在企业网络中的应用越来越广泛，如何进行合理的 WLAN 规划...',
    category: 'wireless-basic',
    parentCategory: 'wireless',
    date: '2026-03-20',
    views: 745,
    tags: ['WLAN', '无线', 'AC+AP']
  },
  {
    id: 9,
    title: 'AC+AP 模式详细配置',
    excerpt: 'AC+AP 是企业 WLAN 的主流部署模式，本文介绍 CAPWAP 隧道和配置要点...',
    category: 'wireless-acap',
    parentCategory: 'wireless',
    date: '2026-03-18',
    views: 892,
    tags: ['AC', 'AP', 'CAPWAP']
  },
  {
    id: 10,
    title: '数据中心 Spine-Leaf 架构设计',
    excerpt: '传统三层架构已经无法满足现代数据中心的需求，Spine-Leaf 架构应运而生...',
    category: 'datacenter-spineleaf',
    parentCategory: 'datacenter',
    date: '2026-03-18',
    views: 1089,
    tags: ['数据中心', 'Spine-Leaf', '架构设计']
  },
  {
    id: 11,
    title: 'TeamViewer 远程协助配置指南',
    excerpt: 'TeamViewer 是最常用的远程协助工具之一，本文介绍其高级配置和使用技巧...',
    category: 'remote-teamviewer',
    parentCategory: 'remote',
    date: '2026-03-16',
    views: 1876,
    tags: ['TeamViewer', '远程协助', '配置']
  },
  {
    id: 12,
    title: 'Windows 远程桌面 (RDP) 深度使用',
    excerpt: 'Windows 远程桌面协议 (RDP) 的详细配置，包括多用户、端口转发等高级功能...',
    category: 'remote-rdp',
    parentCategory: 'remote',
    date: '2026-03-14',
    views: 2345,
    tags: ['RDP', 'Windows', '远程桌面']
  },
  {
    id: 13,
    title: 'SSH 远程连接与端口转发',
    excerpt: 'SSH 不仅是安全的远程登录工具，还支持多种端口转发模式，实现安全的远程访问。本文详细介绍华为设备的 SSH 和 Telnet 配置...',
    category: 'remote-ssh',
    parentCategory: 'remote',
    date: '2026-03-12',
    views: 1987,
    tags: ['SSH', '端口转发', 'Linux', 'Telnet', '华为'],
    content: {
      ssh: {
        title: 'SSH 配置详解',
        description: 'SSH (Secure Shell) 是一种加密的网络传输协议，可在不安全的网络中为网络服务提供安全的传输环境。通过 SSH 可以实现安全的远程管理和文件传输。',
        config: `# ========================================
# 华为设备 SSH 服务器配置
# ========================================

# 1. 创建本地管理员用户
local-user admin password cipher -J&7(SW'E2AI>,Z,88J\\:Q!!
local-user admin privilege level 15
local-user admin service-type ssh

# 2. 启用 Stelnet 服务器功能
stelnet server enable

# 3. 配置 SSH 认证方式为密码认证
ssh authentication-type default password

# 4. 配置用户界面（Console 和 VTY）
user-interface con 0
user-interface vty 0 4
 authentication-mode aaa
 protocol inbound ssh

# 5. 配置设备登录密码（可选，用于 Console 口登录）
user-interface con 0
 authentication-mode password
 set authentication password cipher N<{9C'-H>Mq>l=&#UQ@OMS:#
user-interface vty 0 4

# 6. 保存配置
return`,
        notes: [
          'SSH 使用加密传输，默认端口 22，安全性高',
          '支持密码认证和密钥认证两种方式',
          '生产环境推荐使用密钥认证，禁用密码认证',
          'VTY 0-4 表示支持 5 个并发 SSH 连接',
          'privilege level 15 表示最高管理员权限',
          'cipher 表示密码以密文形式存储'
        ],
        tips: [
          '建议修改默认 SSH 端口 22 为非标准端口',
          '配置 ACL 限制 SSH 访问来源 IP',
          '定期更换管理员密码',
          '启用 SSH 日志审计功能'
        ]
      },
      telnet: {
        title: 'Telnet 配置详解',
        description: 'Telnet 是一种应用层协议，用于在 Internet 或局域网上提供双向的、面向文本的通信设施。由于使用明文传输，安全性较低。',
        config: `# ========================================
# 华为设备 Telnet 服务器配置
# ========================================

# 1. 创建本地管理员用户
local-user admin password cipher -J&7(SW'E2AI>,Z,88J\\:Q!!
local-user admin privilege level 15
local-user admin service-type telnet

# 2. 启用 Telnet 服务器功能
telnet server enable

# 3. 配置用户界面（Console 和 VTY）
user-interface con 0
user-interface vty 0 4
 authentication-mode aaa
 protocol inbound telnet

# 4. 配置设备登录密码（可选，用于 Console 口登录）
user-interface con 0
 authentication-mode password
 set authentication password cipher N<{9C'-H>Mq>l=&#UQ@OMS:#
user-interface vty 0 4

# 5. 保存配置
return`,
        notes: [
          'Telnet 使用明文传输，默认端口 23，安全性低',
          '仅建议在内部测试环境或隔离网络中使用',
          '生产环境强烈建议使用 SSH 替代 Telnet',
          '所有传输数据（包括密码）都是明文的',
          '容易被嗅探和中间人攻击'
        ],
        tips: [
          '如必须使用 Telnet，请配置 ACL 限制访问来源',
          '仅在测试环境或维护网络中使用',
          '使用后立即关闭 Telnet 服务',
          '考虑使用带外管理网络'
        ]
      },
      comparison: [
        { item: '安全性', ssh: '加密传输，安全可靠', telnet: '明文传输，不安全' },
        { item: '默认端口', ssh: '22', telnet: '23' },
        { item: '加密方式', ssh: '对称/非对称加密', telnet: '无加密' },
        { item: '认证方式', ssh: '密码/密钥认证', telnet: '仅密码认证' },
        { item: '性能开销', ssh: '加解密消耗 CPU', telnet: '无加密开销' },
        { item: '防窃听', ssh: '支持', telnet: '不支持' },
        { item: '防篡改', ssh: '支持', telnet: '不支持' },
        { item: '推荐场景', ssh: '生产环境、外网、远程管理', telnet: '内网测试、临时调试' }
      ],
      portForwarding: {
        title: 'SSH 端口转发配置',
        description: 'SSH 端口转发（隧道）可以将其他 TCP 端口的数据通过 SSH 连接进行转发，实现安全的数据传输。',
        types: [
          {
            name: '本地端口转发',
            syntax: 'ssh -L [本地端口]:[目标主机]:[目标端口] [SSH 服务器]',
            example: 'ssh -L 8080:internal-server:80 user@ssh-server',
            description: '将本地 8080 端口的流量转发到内部服务器的 80 端口'
          },
          {
            name: '远程端口转发',
            syntax: 'ssh -R [远程端口]:[目标主机]:[目标端口] [SSH 服务器]',
            example: 'ssh -R 8080:localhost:80 user@ssh-server',
            description: '将 SSH 服务器的 8080 端口流量转发到本地的 80 端口'
          },
          {
            name: '动态端口转发（SOCKS 代理）',
            syntax: 'ssh -D [本地端口] [SSH 服务器]',
            example: 'ssh -D 1080 user@ssh-server',
            description: '在本地创建一个 SOCKS 代理，通过 SSH 隧道转发所有流量'
          }
        ]
      }
    }
  },
  {
    id: 14,
    title: 'Python 网络自动化入门',
    excerpt: '使用 Python 进行网络设备自动化配置，提高运维效率...',
    category: 'automation-python',
    parentCategory: 'automation',
    date: '2026-03-15',
    views: 2103,
    tags: ['Python', '自动化', 'Netmiko']
  },
  {
    id: 15,
    title: '大型园区网项目实战总结',
    excerpt: '某大型企业园区网络建设项目，从需求分析到实施方案的全流程记录...',
    category: 'projects-campus',
    parentCategory: 'projects',
    date: '2026-03-10',
    views: 3256,
    tags: ['项目实战', '园区网', '案例分享']
  }
])

// 计算属性：过滤后的笔记列表
const filteredNotes = computed(() => {
  let result = [...notesData.value]

  // 按分类过滤
  if (activeCategory.value !== 'all') {
    // 检查是否是子分类
    const isSubCategory = activeCategory.value.includes('-')

    if (isSubCategory) {
      // 精确匹配子分类
      result = result.filter(note => note.category === activeCategory.value)
    } else {
      // 匹配父分类下的所有笔记
      result = result.filter(note =>
        note.parentCategory === activeCategory.value ||
        note.category === activeCategory.value
      )
    }
  }

  // 按搜索词过滤
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(note =>
      note.title.toLowerCase().includes(query) ||
      note.excerpt.toLowerCase().includes(query) ||
      note.tags.some(tag => tag.toLowerCase().includes(query))
    )
  }

  // 排序
  if (sortBy.value === 'latest') {
    result.sort((a, b) => new Date(b.date) - new Date(a.date))
  } else if (sortBy.value === 'views') {
    result.sort((a, b) => b.views - a.views)
  } else if (sortBy.value === 'oldest') {
    result.sort((a, b) => new Date(a.date) - new Date(b.date))
  }

  return result
})

// 处理分类点击
const handleCategoryClick = (key) => {
  console.log('点击分类:', key)
  activeCategory.value = key
  // 阻止默认行为，不进行路由跳转
  return false
}

// 处理搜索
const handleSearch = () => {
  console.log('搜索:', searchQuery.value)
}

// 处理排序变化
const handleSortChange = (value) => {
  console.log('排序方式:', value)
}

// 按标签过滤
const filterByTag = (tagName) => {
  searchQuery.value = tagName
}

// 查看笔记详情
const viewNote = (noteId) => {
  const note = notesData.value.find(n => n.id === noteId)
  if (note) {
    currentNote.value = note
  }
}

// 返回列表
const goBackToList = () => {
  currentNote.value = null
}

// 获取分类对应的类型
const getCategoryType = (category) => {
  const typeMap = {
    'routing-switching': 'primary',
    'routing-bfd': 'primary',
    'routing-ospf': 'primary',
    'routing-bgp': 'primary',
    'switching-vlan': 'primary',
    'switching-stp': 'primary',
    'security': 'error',
    'security-firewall': 'error',
    'security-acl': 'error',
    'security-nat': 'error',
    'security-port': 'error',
    'wireless': 'success',
    'wireless-basic': 'success',
    'wireless-acap': 'success',
    'wireless-optimization': 'success',
    'wireless-security': 'success',
    'datacenter': 'warning',
    'datacenter-spineleaf': 'warning',
    'datacenter-virtualization': 'warning',
    'datacenter-storage': 'warning',
    'datacenter-lb': 'warning',
    'remote': 'info',
    'remote-ssh': 'info',
    'remote-telnet': 'info',
    'remote-rdp': 'info',
    'remote-teamviewer': 'info',
    'remote-forwarding': 'info',
    'automation': 'success',
    'automation-python': 'success',
    'automation-ansible': 'success',
    'automation-netconf': 'success',
    'automation-api': 'success',
    'projects': 'default',
    'projects-campus': 'default',
    'projects-datacenter': 'default',
    'projects-wireless': 'default',
    'projects-security': 'default'
  }
  return typeMap[category] || 'default'
}

// 获取分类名称
const getCategoryName = (category) => {
  const nameMap = {
    'routing-bfd': 'BFD 配置',
    'routing-ospf': 'OSPF 协议',
    'routing-bgp': 'BGP 配置',
    'switching-vlan': 'VLAN 划分',
    'switching-stp': 'STP/RSTP',
    'security-firewall': '防火墙策略',
    'security-acl': 'ACL 访问控制',
    'security-nat': 'NAT 配置',
    'security-port': '端口安全',
    'wireless-basic': 'WLAN 基础',
    'wireless-acap': 'AC+AP 配置',
    'wireless-optimization': '无线优化',
    'wireless-security': '无线安全',
    'datacenter-spineleaf': 'Spine-Leaf 架构',
    'datacenter-virtualization': '虚拟化技术',
    'datacenter-storage': '存储网络',
    'datacenter-lb': '负载均衡',
    'remote-ssh': 'SSH 配置',
    'remote-telnet': 'Telnet 配置',
    'remote-rdp': 'RDP 远程桌面',
    'remote-teamviewer': 'TeamViewer',
    'remote-forwarding': '端口转发',
    'automation-python': 'Python 脚本',
    'automation-ansible': 'Ansible',
    'automation-netconf': 'NETCONF/YANG',
    'automation-api': 'API 集成',
    'projects-campus': '园区网项目',
    'projects-datacenter': '数据中心项目',
    'projects-wireless': '无线覆盖项目',
    'projects-security': '安全加固项目'
  }
  return nameMap[category] || category
}

// 复制代码
const copyCode = (code) => {
  navigator.clipboard.writeText(code)
  window.$message.success('代码已复制到剪贴板')
}

// 对比表格列配置
const comparisonColumns = [
  {
    title: '特性',
    key: 'feature',
    width: 150
  },
  {
    title: 'SSH',
    key: 'ssh',
    width: 150
  },
  {
    title: 'Telnet',
    key: 'telnet',
    width: 150
  }
]

</script>

<style scoped>
.notes-container {
  display: flex;
  min-height: calc(100vh - 200px);
  background: linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%);
  padding: 24px;
  gap: 24px;
  max-width: 1600px;
  margin: 0 auto;
}

/* 左侧边栏 */
.sidebar {
  width: 280px;
  flex-shrink: 0;
}

.sidebar-content {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: sticky;
  top: 96px;
}

.sidebar-title {
  color: #fff;
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 20px 0;
  padding-bottom: 12px;
  border-bottom: 2px solid rgba(255, 255, 255, 0.1);
}

.category-menu {
  margin-bottom: 24px;
}

.category-menu :deep(.n-menu-item) {
  .n-menu-item-content {
    color: rgba(255, 255, 255, 0.7);
    border-radius: 8px;
    transition: all 0.3s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.08);
      color: #fff;
    }

    &--active {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #fff !important;
    }
  }
}

.category-menu :deep(.n-submenu) {
  .n-menu-item-content {
    padding-left: 40px;
    font-size: 14px;
  }
}

.tags-section {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.tags-title {
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
  font-weight: 500;
  margin: 0 0 16px 0;
}

.tags-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.tags-list .n-tag {
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateX(4px);
  }
}

/* 主内容区 */
.notes-main {
  flex: 1;
  min-width: 0;
}

.content-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 32px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.filter-bar {
  display: flex;
  gap: 16px;
  margin-bottom: 32px;
}

.search-input {
  flex: 1;
  max-width: 400px;
}

.search-input :deep(.n-input) {
  background-color: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);

  .n-input__input-el {
    color: #fff;

    &::placeholder {
      color: rgba(255, 255, 255, 0.5);
    }
  }

  .n-input__prefix {
    color: rgba(255, 255, 255, 0.6);
  }
}

.sort-select {
  width: 160px;
}

.sort-select :deep(.n-input) {
  background-color: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  color: #fff;
}

/* 笔记列表 */
.notes-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.note-card {
  background: rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.12);
    border-color: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  }
}

.note-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.note-title {
  color: #fff;
  font-size: 20px;
  font-weight: 600;
  margin: 0;
  flex: 1;
}

.note-excerpt {
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  line-height: 1.8;
  margin: 0 0 20px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.note-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.note-meta {
  display: flex;
  gap: 16px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 13px;
}

.note-date,
.note-views {
  display: flex;
  align-items: center;
  gap: 6px;
}

.note-date .n-icon,
.note-views .n-icon {
  font-size: 16px;
  color: #4a90e2;
}

.note-tags {
  display: flex;
  gap: 8px;
}

.empty-state {
  padding: 60px 0;
}

/* 笔记详情 */
.note-detail-view {
  color: #fff;
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

/* 响应式设计 */
@media (max-width: 1024px) {
  .notes-container {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;

    .sidebar-content {
      position: static;
    }
  }

  .filter-bar {
    flex-direction: column;
  }

  .search-input {
    max-width: 100%;
  }

  .sort-select {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .notes-container {
    padding: 16px;
  }

  .content-card {
    padding: 20px;
  }

  .note-header {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }

  .note-footer {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }
}

.tips-list {
  background: rgba(76, 175, 80, 0.05);
  padding: 20px;
  border-radius: 8px;
  border-left: 4px solid #4caf50;
  margin-top: 16px;
}

.tips-list h3 {
  color: #4caf50;
  font-size: 16px;
  margin: 0 0 12px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.tips-list ul {
  margin: 0;
  padding-left: 20px;
}

.tips-list li {
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  line-height: 2;
}

.forwarding-types {
  display: grid;
  gap: 24px;
}

.forwarding-type {
  background: rgba(0, 188, 212, 0.05);
  padding: 20px;
  border-radius: 8px;
  border-left: 4px solid #00bcd4;
}

.forwarding-type h3 {
  color: #00bcd4;
  font-size: 18px;
  margin: 0 0 12px 0;
}

.type-desc {
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  line-height: 1.8;
  margin-bottom: 16px;
}

.code-snippet {
  background: rgba(0, 0, 0, 0.3);
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 12px;
}

.snippet-title {
  color: #4a90e2;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 8px;
}

.code-snippet code {
  color: #a8ff78;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 13px;
  display: block;
  overflow-x: auto;
}
</style>