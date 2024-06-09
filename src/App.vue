<script setup>
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from '@/components/ui/navigation-menu'
</script>

<template>
  <NavigationMenu>
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
    </NavigationMenuList>
  </NavigationMenu>
  <main>
    <RouterView />
  </main>
</template>
