<script setup lang="ts">
definePageMeta({
    layout: 'default'
});

const scrollConfig = reactive({
    text: '                       Swedish frontend developer & photographer. UI/UX / this / *  Based: Barcelona / London ...',
    speed:"1"
})

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
        <UITextScroller :text="scrollConfig.text" :speed="scrollConfig.speed"/>
    </div>
</template>

<style lang="scss" scoped>
.pin {
    height: 100vh;
}

// might be the gsap but we really need wait for both components to render on next tick
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