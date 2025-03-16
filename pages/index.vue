<script setup lang="ts">
definePageMeta({
    layout: 'default'
});

const isNext = ref<boolean>(false)

onMounted(() => {
    nextTick(() => {
        isNext.value = true;
    })
})
</script>

<template>
    <div class="home-wrapper" :class="{ show: isNext }">
        <ViewHero />
        <ViewSelProjects />
    </div>
</template>

<style lang="scss" scoped>
.pin {
    height: 100vh;
}

// might be the gsap but we really need wait for both components to rener on next tick
.show {
    visibility: visible !important;
}

.home-wrapper {
    visibility: hidden;
    overflow-y: hidden;
    flex-flow: column;
    display: flex;
    position: relative;
}
</style>