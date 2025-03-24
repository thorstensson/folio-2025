<script setup lang="ts">

</script>

<template>
  <div>
    <UIMouseCursor />
    <CommonHeader />
    <div class="folio-wrapper">
      <slot />
    </div>
    <CommonFooter />
  </div>
</template>

<style scoped>
.folio-wrapper {
  overflow-y: hidden;
  padding-right: 20px; /* 3 */
  padding-left:  20px; /* 3 */
}
</style>