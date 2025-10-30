<template>
  <div class="container mx-auto p-4">
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink as-child :active="$route.name === 'home'">
            <RouterLink to="/">Home</RouterLink>
          </NavigationMenuLink>
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <NavigationMenuLink as-child :active="$route.name === 'singleplayer'">
            <RouterLink to="/games/singleplayer">Single Player</RouterLink>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink as-child :active="$route.name === 'about'">
            <RouterLink to="/about">About</RouterLink>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>

    <main class="mt-6">
      <RouterView /> 
    </main>
  </div>
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu'
</script>