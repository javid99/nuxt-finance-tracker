<template>
   <div class="grid grid-cols-6 gap-8">
      <div class="col-span-2">
         <UVerticalNavigation :links="links" />
      </div>
      <div class="col-span-4">
         <NuxtPage />
      </div>
   </div>
</template>

<script lang="ts" setup>
const links = [
   {
      label: "profile",
      to: "/settings/profile",
   },
   {
      label: "avatar",
      to: "/settings/avatar",
   },
   {
      label: "settings",
      to: "/settings/settings",
   },
];
</script>

<style></style>
