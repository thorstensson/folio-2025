<script setup lang="ts">

definePageMeta({
    layout: 'default'
});

const route = useRoute();
console.log(route.params.id)
</script>

<template>
    <div class="test">Route is {{ route.params.id }}</div>
</template>

<style scoped>
.test {
    height: 100vh;
}
</style>