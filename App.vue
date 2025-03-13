<script setup lang="ts">

const isMounted = ref<boolean>(false);

onMounted(() => {
    isMounted.value = true

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
    min-height: 100vh;
    margin:0;
    padding:0;
}

</style>