import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Publish from '../views/Publish.vue'
import MyItems from '../views/MyItems.vue'
import ItemDetail from '../views/ItemDetail.vue'
import MyExchanges from '../views/MyExchanges.vue'
import TagRanking from '../views/TagRanking.vue'
import TagItems from '../views/TagItems.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/publish', name: 'Publish', component: Publish },
  { path: '/my-items', name: 'MyItems', component: MyItems },
  { path: '/my-exchanges', name: 'MyExchanges', component: MyExchanges },
  { path: '/item/:id', name: 'ItemDetail', component: ItemDetail, props: true },
  { path: '/tags', name: 'TagRanking', component: TagRanking },
  { path: '/tag/:tag', name: 'TagItems', component: TagItems, props: true }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
