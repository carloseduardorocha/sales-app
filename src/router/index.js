import { createRouter, createWebHistory } from 'vue-router'
import { authService } from '@/services/authService';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/Login.vue'),
    },
    {
      path: '/logout',
      name: 'logout',
      beforeEnter: async (to, from, next) => {
        await authService.logout();
        next({ name: 'login' });
      }
    }
  ],
})

router.beforeEach((to, from, next) => {
  if (to.name === 'login' && authService.isAuthenticated()) {
    next({ name: 'sellers' });
  } else if (to.meta.requiresAuth && !authService.isAuthenticated()) {
    next({ name: 'login' });
  } else {
    next();
  }
});

export default router
