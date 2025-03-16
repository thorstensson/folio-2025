<script setup lang="ts">
import Lenis from 'lenis'
const isMounted = ref<boolean>(false);

onMounted(() => {
    isMounted.value = true
    // Initialize Lenis
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

<style>
html,
body {
    background-color: #E7F6F2;
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
    -moz-font-smoothing: antialiased;
    -o-font-smoothing: antialiased;
}

body {
    display: flex;
    flex-direction: column;

    margin: 0;
    padding: 0;
}
</style>