<script setup>
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from '@/components/ui/navigation-menu'
import {useAuthStore} from "@/store/authStore.js";

const authStore = useAuthStore()
</script>

<template>
  <NavigationMenu class="mb-5">
    <NavigationMenuList>
      <NavigationMenuItem>
        <RouterLink to="/">Go to Home</RouterLink>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <RouterLink to="/login">Login</RouterLink>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <RouterLink to="/register">Register</RouterLink>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <RouterLink to="/contacts">Add Contact</RouterLink>
      </NavigationMenuItem>
    </NavigationMenuList>
  </NavigationMenu>
  <Button @click="authStore.logout()">Sign out</Button>
  <main>
    <RouterView />
  </main>
</template>
