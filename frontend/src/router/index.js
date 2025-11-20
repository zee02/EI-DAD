import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/pages/home/HomePage.vue'
import AboutPage from '@/pages/about/AboutPage.vue'
import LoginPage from '@/pages/login/LoginPage.vue'
import ProfilePage from '@/pages/profile/ProfilePage.vue'
import ThemesListPage from '@/pages/themes/ThemesListPage.vue'
import ThemeEditorPage from '@/pages/themes/ThemeEditorPage.vue'
import SingleplayerGamePage from '@/pages/game/SingleplayerGamePage.vue'
import MultiplayerLobbyPage from '@/pages/game/MultiplayerLobbyPage.vue'
import MultiplayerGamePage from '@/pages/game/MultiplayerGamePage.vue'

import { useAuthStore } from '@/stores/auth'
import { toast } from 'vue-sonner'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomePage },
    { path: '/about', name: 'about', component: AboutPage },
    { path: '/login', name: 'login', component: LoginPage },
    
    // Rotas Protegidas (meta: requiresAuth: true)
    { path: '/profile', name: 'profile', component: ProfilePage, meta: { requiresAuth: true } },
    { path: '/themes', name: 'themes', component: ThemesListPage, meta: { requiresAuth: true } },
    { path: '/themes/new', name: 'themes-new', component: ThemeEditorPage, meta: { requiresAuth: true } },
    { path: '/themes/:id', name: 'themes-edit', component: ThemeEditorPage, meta: { requiresAuth: true } },

    {
      path: '/games',
      children: [
        { path: 'singleplayer', name: 'singleplayer', component: SingleplayerGamePage },
        // Rotas Multiplayer
        { path: 'lobby', name: 'multiplayer-lobby', component: MultiplayerLobbyPage, meta: { requiresAuth: true } },
        { path: 'multiplayer', name: 'multiplayer', component: MultiplayerGamePage, meta: { requiresAuth: true } },
      ],
    },
  ],
})

// Route Guard (Passo 16)
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    toast.error('This navigation requires authentication')
    next({ name: 'login' })
  } else {
    next()
  }
})

export default router