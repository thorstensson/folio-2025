<script setup lang="ts">
import { SpeakerWaveIcon, SpeakerXMarkIcon } from '@heroicons/vue/24/solid'

const model = defineModel({ default: false })

defineProps<{ title: string }>()

const togglePlay = () => {
    model.value = !model.value
}
</script>

<template>
    <div class="controls">
        <Icon name="mdi:speaker-play" mode="svg" size="38" @click="togglePlay" class="controls__on"
            :class="{ 'controls__on--show': !model }" />
        <Icon name="mdi:speaker-stop" mode="svg" size="38" @click="togglePlay" class="controls__off"
            :class="{ 'controls__off--show': model }" />
    </div>
</template>

<style lang="scss" scoped>
.controls {

    &__on,
    &__off {
        color: $secondary;
        position: absolute;
        padding-bottom: 8px;
        display: none;
        transition: color .3s;
        cursor: pointer;

        &--show {
            display: block;
            color: $secondary;
        }

        @media (hover: hover) {
            &:hover {
                color: $accent3;
            }
        }
    }
}
</style> +