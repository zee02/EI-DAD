import { createRouter, createWebHistory } from 'vue-router'
// Importar os componentes das páginas
import HomePage from '@/pages/home/HomePage.vue'
import SingleplayerGamePage from '@/pages/game/SinglePlayerGamePage.vue'
import AboutPage from '@/pages/about/AboutPage.vue' // (Implícito)
import LoginPage from '@/pages/login/LoginPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
    },
    {
      path: '/games',
      // Rota sem componente, apenas para agrupar
      children: [
        {
          path: 'singleplayer',
          name: 'singleplayer',
          component: SingleplayerGamePage,
        },
      ]
    },
    {
      path: '/about',
      name: 'about',
      component: AboutPage,
    }
    ,
    {
      path: '/login',
      name: 'login',
      component: LoginPage,
    }
  ]
})

export default router