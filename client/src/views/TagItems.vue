<template>
  <div>
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;">
      <div>
        <h1 style="color:white;margin-bottom:8px;">
          🏷️ 标签：<span style="background:linear-gradient(135deg, #f093fb 0%, #f5576c 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">{{ tagName }}</span>
        </h1>
        <p style="color:rgba(255,255,255,0.8);">
          共找到 {{ items.length }} 个带有此标签的盲盒
        </p>
      </div>
      <div style="display:flex;gap:12px;">
        <router-link to="/tags">
          <button class="btn btn-secondary" style="padding:10px 20px;">
            🔥 标签热力榜
          </button>
        </router-link>
        <router-link to="/">
          <button class="btn btn-secondary" style="padding:10px 20px;">
            ← 返回首页
          </button>
        </router-link>
      </div>
    </div>

    <div v-if="loading" style="text-align:center;padding:60px;color:white;">
      加载中...
    </div>

    <div v-else-if="items.length === 0" class="empty-state card">
      <h2>暂无相关盲盒</h2>
      <p>该标签下还没有盲盒，去看看其他标签吧！</p>
      <router-link to="/tags" style="margin-top:16px;display:inline-block;">
        <button class="btn btn-primary">浏览标签热力榜</button>
      </router-link>
    </div>

    <div v-else class="grid grid-3">
      <router-link
        v-for="item in items"
        :key="item.id"
        :to="'/item/' + item.id"
        style="text-decoration:none;color:inherit;"
      >
        <div class="card" style="padding:0;overflow:hidden;cursor:pointer;">
          <div style="width:100%;height:200px;overflow:hidden;background:#f0f0f0;position:relative;">
            <img :src="appendAuth(item.image)" alt="盲盒图片"
                 style="width:100%;height:100%;object-fit:cover;"/>
            <div style="position:absolute;top:12px;right:12px;">
              <span :class="item.status === 'available' ? 'badge badge-available' : 'badge badge-exchanged'">
                {{ item.status === 'available' ? '可交换' : '已交换' }}
              </span>
            </div>
          </div>
          <div style="padding:16px;">
            <h3 style="margin-bottom:8px;font-size:16px;">{{ getCategoryName(item.category) }}</h3>
            <div style="margin-bottom:8px;">
              <span v-for="tag in item.mysteryTags" :key="tag" class="tag" :class="{ 'tag-active': tag === tagName }">
                {{ tag }}
              </span>
            </div>
            <p style="color:#999;font-size:12px;">
              发布于 {{ formatDate(item.createdAt) }}
            </p>
          </div>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getItemsByTag, appendAuth } from '../api/index.js'
import { userStore } from '../store/user.js'

const route = useRoute()
const items = ref([])
const loading = ref(true)

const tagName = ref(decodeURIComponent(route.params.tag))

const categories = {
  book: '书籍类',
  figure: '手办类',
  toy: '玩具类',
  game: '游戏类',
  digital: '数码类',
  other: '其他'
}

function getCategoryName(key) {
  return categories[key] || key
}

function formatDate(dateStr) {
  const date = new Date(dateStr)
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return y + '-' + m + '-' + d
}

async function loadItems() {
  loading.value = true
  try {
    items.value = await getItemsByTag(tagName.value, userStore.user.id)
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

watch(() => route.params.tag, (newTag) => {
  tagName.value = decodeURIComponent(newTag)
  loadItems()
})

onMounted(loadItems)
</script>

<style scoped>
.tag-active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.4);
}
</style>
