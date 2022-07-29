import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/logwork',
      name: 'logwork',
      component: () => import('../views/IssueListView.vue')
    },
    {
      path: '/assignToMe',
      name: 'assignToMe',
      component: () => import('../views/AssignToMe.vue')
    },
    {
      path: '/history',
      name: 'history',
      component: () => import('../views/HistoryView.vue')
    },
    {
      path: '/history/v2',
      name: 'history',
      component: () => import('../views/HistoryV2View.vue')
    }
  ]
})

export default router
