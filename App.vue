<script setup lang="ts">
import Lenis from 'lenis'
const isMounted = ref<boolean>(false);

onMounted(() => {
    isMounted.value = true
    // Initialize Lenis for smoth scroll
    const lenis = new Lenis({
        autoRaf: true,
    });

    lenis?.scrollTo(0, { immediate: true });
})
</script>

<template>
    <div class="hide" :class="{ 'on-ready': isMounted }">
        <NuxtLayout>
            <NuxtPage />
        </NuxtLayout>
    </div>
</template>

<style lang="scss">
html,
body {
    background-color: $primary;
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
    -moz-font-smoothing: antialiased;
    -o-font-smoothing: antialiased;
    font-family: $sans-text;
}

html {
      scroll-snap-type: y proximity;
    }
.html{
      /* Adjust font size */
  -webkit-text-size-adjust: 100%;
  /* Font varient */
  font-variant-ligatures: none;
  -webkit-font-variant-ligatures: none;
  /* Smoothing */
  text-rendering: optimizeLegibility;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
}

body {
    display: flex;
    flex-direction: column;
    margin: 0;
    padding: 0;
}
</style>