<script setup>

const { strokeColor } = defineProps(['strokeColor'])

</script>

<template>
  <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style="stop-color:#4a238e;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#f43f5e;stop-opacity:1" />
      </linearGradient>
    </defs>
    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
    <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
    <g id="SVGRepo_iconCarrier">
      <path
          d="M19.4003 18C19.7837 17.2499 20 16.4002 20 15.5C20 12.4624 17.5376 10 14.5 10C11.4624 10 9 12.4624 9 15.5C9 18.5376 11.4624 21 14.5 21L21 21C21 21 20 20 19.4143 18.0292M18.85 12C18.9484 11.5153 19 11.0137 19 10.5C19 6.35786 15.6421 3 11.5 3C7.35786 3 4 6.35786 4 10.5C4 11.3766 4.15039 12.2181 4.42676 13C5.50098 16.0117 3 18 3 18H9.5"
          :class="strokeColor ? strokeColor : 'fill-url(#grad1)'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
    </g>
  </svg>
</template>
