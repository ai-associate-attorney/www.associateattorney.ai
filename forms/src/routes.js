import { createRouter, createWebHistory } from 'vue-router';
import DashboardCt from '@/components/DashboardCt.vue';
import FormFill from '@/components/FormFill.vue';

const routes = [
  {
    path: '/',
    name: 'dashboard',
    component: DashboardCt
  },
  {
    path: '/:jurisdiction/:id',
    name: 'form-fill',
    component: FormFill
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL || '/forms'),
  routes
});

export default router;