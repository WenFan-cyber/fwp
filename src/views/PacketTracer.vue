<script setup>
import { ref } from 'vue'

const activeTab = ref('ar1')

const ar1Config = `[Huawei]bfd #创建 BFD 配置视图
[Huawei-bfd]quit
[Huawei]bfd 1 bind peer-ip 1.1.1.2 source-ip 1.1.1.1 #配置 BFD 会话绑定信息
[Huawei-bfd-session-1]discriminator local 1 #配置 BFD 会话的本地标识符
[Huawei-bfd-session-1]discriminator remote 2 #配置 BFD 会话的远端标识符
[Huawei-bfd-session-1]commit #用于提交会话配置
[Huawei-bfd-session-1]di th
[V200R003C00]
#
bfd 1 bind peer-ip 1.1.1.2 source-ip 1.1.1.1
 discriminator local 1
 discriminator remote 2
 commit
#`

const ar2Config = `[Huawei]bfd #创建 BFD 配置视图
[Huawei-bfd]quit
[Huawei]bfd 1 bind peer-ip 1.1.1.1 source-ip 1.1.1.2 #配置 BFD 会话绑定信息
[Huawei-bfd-session-1]discriminator local 2 #配置 BFD 会话的本地标识符
[Huawei-bfd-session-1]discriminator remote 1 #配置 BFD 会话的远端标识符
[Huawei-bfd-session-1]commit #用于提交会话配置
[Huawei-bfd-session-1]di th
[V200R003C00]
#
bfd 1 bind peer-ip 1.1.1.1 source-ip 1.1.1.2
 discriminator local 2
 discriminator remote 1
 commit
#`
</script>

<template>
  <div class="packet-tracer-container">
    <div class="content-card">
      <h1 class="title">Packet Tracer - BFD 配置</h1>

      <div class="tabs">
        <button
            class="tab-btn"
            :class="{ active: activeTab === 'ar1' }"
            @click="activeTab = 'ar1'"
        >
          AR1 配置
        </button>
        <button
            class="tab-btn"
            :class="{ active: activeTab === 'ar2' }"
            @click="activeTab = 'ar2'"
        >
          AR2 配置
        </button>
      </div>

      <div class="code-section">
        <div class="code-header">
          <span class="device-name">{{ activeTab === 'ar1' ? 'AR1' : 'AR2' }}</span>
          <span class="description">
            {{ activeTab === 'ar1'
              ? '主设备配置 - 本地标识符：1, 远端标识符：2'
              : '备设备配置 - 本地标识符：2, 远端标识符：1'
            }}
          </span>
        </div>

        <pre class="code-block"><code>{{ activeTab === 'ar1' ? ar1Config : ar2Config }}</code></pre>
      </div>

      <div class="info-box">
        <div class="info-item">
          <strong>拓扑说明：</strong>
          <p>AR1 与 AR2 建立 BFD 会话，实现双向转发检测</p>
        </div>
        <div class="info-item">
          <strong>IP 地址规划：</strong>
          <p>AR1: 1.1.1.1 | AR2: 1.1.1.2</p>
        </div>
        <div class="info-item">
          <strong>BFD 参数：</strong>
          <p>会话 ID: 1 | 本地标识符/远端标识符：1/2 (AR1) 或 2/1 (AR2)</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.packet-tracer-container {
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  background: linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%);
}

.content-card {
  max-width: 1200px;
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 48px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin: 0 auto;
}

.title {
  color: #fff;
  font-size: 32px;
  text-align: center;
  margin-bottom: 40px;
  font-weight: 600;
}

.tabs {
  display: flex;
  gap: 16px;
  margin-bottom: 32px;
  justify-content: center;
}

.tab-btn {
  padding: 12px 32px;
  font-size: 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.7);
  transition: all 0.3s ease;
  font-weight: 500;
}

.tab-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
}

.tab-btn.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.code-section {
  margin-bottom: 32px;
}

.code-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
  padding: 12px 16px;
  background: rgba(102, 126, 234, 0.2);
  border-radius: 8px;
  border-left: 4px solid #667eea;
}

.device-name {
  color: #667eea;
  font-weight: 600;
  font-size: 18px;
}

.description {
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
}

.code-block {
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 24px;
  overflow-x: auto;
  position: relative;
}

.code-block code {
  color: #a8ff78;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 14px;
  line-height: 1.8;
  white-space: pre;
}

.info-box {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 32px;
}

.info-item {
  background: rgba(255, 255, 255, 0.08);
  padding: 20px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.info-item strong {
  color: #00d2ff;
  display: block;
  margin-bottom: 12px;
  font-size: 16px;
}

.info-item p {
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .content-card {
    padding: 32px 24px;
  }

  .title {
    font-size: 24px;
  }

  .tabs {
    flex-direction: column;
  }

  .tab-btn {
    width: 100%;
  }

  .info-box {
    grid-template-columns: 1fr;
  }
}
</style>
