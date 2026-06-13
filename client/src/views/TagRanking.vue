<template>
  <div>
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;">
      <div>
        <h1 style="color:white;margin-bottom:8px;">🔥 神秘标签热力榜</h1>
        <p style="color:rgba(255,255,255,0.8);">探索全站热门标签，发现更多精彩盲盒</p>
      </div>
      <router-link to="/">
        <button class="btn btn-secondary" style="padding:10px 20px;">
          ← 返回首页
        </button>
      </router-link>
    </div>

    <div v-if="loading" style="text-align:center;padding:60px;color:white;">
      加载中...
    </div>

    <div v-else>
      <div class="card" style="margin-bottom:24px;">
        <div style="display:flex;gap:40px;flex-wrap:wrap;">
          <div style="text-align:center;flex:1;min-width:120px;">
            <div style="font-size:36px;font-weight:bold;background:linear-gradient(135deg, #667eea 0%, #764ba2 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">
              {{ stats.totalItems }}
            </div>
            <div style="color:#888;margin-top:4px;">盲盒总数</div>
          </div>
          <div style="text-align:center;flex:1;min-width:120px;">
            <div style="font-size:36px;font-weight:bold;background:linear-gradient(135deg, #f093fb 0%, #f5576c 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">
              {{ stats.totalTags }}
            </div>
            <div style="color:#888;margin-top:4px;">标签总数</div>
          </div>
          <div style="text-align:center;flex:1;min-width:120px;">
            <div style="font-size:36px;font-weight:bold;background:linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">
              {{ stats.maxCount }}
            </div>
            <div style="color:#888;margin-top:4px;">最高出现次数</div>
          </div>
        </div>
      </div>

      <div class="grid grid-2">
        <div class="card">
          <h2 style="margin-bottom:20px;font-size:20px;">🏆 热门标签排行</h2>
          <div v-if="tags.length === 0" class="empty-state" style="padding:40px;">
            <p>暂无标签数据</p>
          </div>
          <div v-else>
            <div
              v-for="(tag, index) in topTags"
              :key="tag.name"
              class="ranking-item"
              @click="goToTag(tag.name)"
            >
              <div class="ranking-number" :class="'rank-' + (index + 1)">
                {{ index + 1 }}
              </div>
              <div style="flex:1;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                  <span style="font-weight:600;font-size:16px;">{{ tag.name }}</span>
                  <span style="color:#667eea;font-weight:600;">{{ tag.count }} 次</span>
                </div>
                <div class="progress-bar">
                  <div
                    class="progress-fill"
                    :style="{ width: getProgressWidth(tag.count) + '%' }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="card">
          <h2 style="margin-bottom:20px;font-size:20px;">☁️ 标签云</h2>
          <div v-if="tags.length === 0" class="empty-state" style="padding:40px;">
            <p>暂无标签数据</p>
          </div>
          <div v-else class="tag-cloud">
            <span
              v-for="tag in tags"
              :key="tag.name"
              class="cloud-tag"
              :style="getTagStyle(tag.count)"
              @click="goToTag(tag.name)"
            >
              {{ tag.name }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getTagStatistics } from '../api/index.js'

const router = useRouter()
const loading = ref(true)
const stats = ref({ totalItems: 0, totalTags: 0, maxCount: 0 })
const tags = ref([])

const topTags = computed(() => tags.value.slice(0, 10))

function getProgressWidth(count) {
  if (stats.value.maxCount === 0) return 0
  return (count / stats.value.maxCount) * 100
}

function getTagStyle(count) {
  const maxCount = stats.value.maxCount || 1
  const ratio = count / maxCount
  const minSize = 14
  const maxSize = 36
  const fontSize = minSize + (maxSize - minSize) * ratio

  const colors = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)'
  ]
  const colorIndex = Math.floor(Math.random() * colors.length)

  return {
    fontSize: fontSize + 'px',
    background: colors[colorIndex]
  }
}

function goToTag(tagName) {
  router.push('/tag/' + encodeURIComponent(tagName))
}

async function loadStatistics() {
  loading.value = true
  try {
    const data = await getTagStatistics()
    stats.value = {
      totalItems: data.totalItems,
      totalTags: data.totalTags,
      maxCount: data.maxCount
    }
    tags.value = data.tags
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

onMounted(loadStatistics)
</script>

<style scoped>
.ranking-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 16px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
  margin-bottom: 8px;
}

.ranking-item:hover {
  background: #f8f9ff;
  transform: translateX(4px);
}

.ranking-number {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: white;
  font-size: 14px;
  background: #ccc;
  flex-shrink: 0;
}

.rank-1 {
  background: linear-gradient(135deg, #ffd700 0%, #ffb347 100%);
  box-shadow: 0 2px 8px rgba(255, 215, 0, 0.4);
}

.rank-2 {
  background: linear-gradient(135deg, #c0c0c0 0%, #a8a8a8 100%);
  box-shadow: 0 2px 8px rgba(192, 192, 192, 0.4);
}

.rank-3 {
  background: linear-gradient(135deg, #cd7f32 0%, #a0522d 100%);
  box-shadow: 0 2px 8px rgba(205, 127, 50, 0.4);
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 4px;
  transition: width 0.5s ease;
}

.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
  align-items: center;
  padding: 20px 0;
  min-height: 300px;
}

.cloud-tag {
  display: inline-block;
  padding: 8px 18px;
  color: white;
  border-radius: 24px;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.cloud-tag:hover {
  transform: scale(1.1) translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}
</style>
