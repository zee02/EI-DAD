<template>
  <Toaster />
  <nav class="max-w-full p-5 flex flex-row justify-between align-middle">
    <div class="align-middle text-xl">
      <RouterLink to="/"> 🧠 Memory Game </RouterLink>
      <span class="text-xs" v-if="authStore.currentUser"
        >&nbsp;&nbsp;&nbsp;({{ authStore.currentUser?.name }})
      </span>
    </div>
    <NavigationMenu>
      <NavigationMenuList class="justify-around gap-20">
        <NavigationMenuItem>
          <NavigationMenuTrigger>Games</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul class="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li>
                <NavigationMenuLink as-child>
                  <RouterLink to="/games/singleplayer">SinglePlayer</RouterLink>
                </NavigationMenuLink>
                <NavigationMenuLink as-child>
                  <RouterLink to="/">MultiPlayer</RouterLink>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink>
            <RouterLink to="/about">About</RouterLink>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem v-if="!authStore.isLoggedIn">
          <NavigationMenuLink>
            <RouterLink to="/login">Login</RouterLink>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem v-else>
          <NavigationMenuTrigger>Account</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul class="grid w-[150px] p-2">
              <li>
                <NavigationMenuLink as-child>
                  <RouterLink
                    to="/profile"
                    class="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  >
                    Profile
                  </RouterLink>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink as-child>
                  <RouterLink
                    to="/themes"
                    class="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  >
                    My Themes
                  </RouterLink>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink as-child>
                  <a
                    @click.prevent="logout"
                    class="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer"
                  >
                    Logout
                  </a>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  </nav>
  <div>
    <main>
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import { Toaster } from '@/components/ui/sonner'
import { toast } from 'vue-sonner'
import 'vue-sonner/style.css'
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const router = useRouter()

const logout = () => {
  toast.promise(authStore.logout(), {
    loading: 'Calling API',
    success: () => {
      // Redireciona para a home após o logout
      router.push({ path: '/' })
      return 'Logout Successful'
    },
    error: (data) => `[API] Error logging out - ${data?.response?.data?.message}`,
  })
}
</script>

<style></style>
