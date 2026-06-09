import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue')
    },
    {
      path: '/agencias',
      name: 'agencias',
      component: () => import('../views/AgenciaView.vue')
    },
    {
      path: '/categorias',
      name: 'categorias',
      component: () => import('../views/CategoriaView.vue')
    },
    {
      path: '/veiculos',
      name: 'veiculos',
      component: () => import('../views/VeiculoView.vue')
    },
    {
      path: '/clientes',
      name: 'clientes',
      component: () => import('../views/ClienteView.vue')
    },
    {
      path: '/funcionarios',
      name: 'funcionarios',
      component: () => import('../views/FuncionarioView.vue')
    },
    {
      path: '/carteiras',
      name: 'carteiras',
      component: () => import('../views/CarteiraView.vue')
    },
    {
      path: '/reservas',
      name: 'reservas',
      component: () => import('../views/ReservaView.vue')
    },
    {
      path: '/pagamentos',
      name: 'pagamentos',
      component: () => import('../views/PagamentoView.vue')
    },
    {
      path: '/multas',
      name: 'multas',
      component: () => import('../views/MultaView.vue')
    }
  ]
})

export default router
