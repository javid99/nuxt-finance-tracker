<template>
   <div>
      <UCard>
         <template #header>Signing in...</template>

         <p>You are signing in. please wait!</p>
      </UCard>
   </div>
</template>

<script lang="ts" setup>
useRedirectAuthenticated();
</script>

<style></style>
