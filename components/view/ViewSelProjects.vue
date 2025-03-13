<script setup lang="ts">
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const { $gsap } = useNuxtApp()

onMounted(async () => {
$gsap.registerPlugin(ScrollTrigger)

let pt = $gsap.timeline({
        // yes, we can add it to an entire timeline!
        scrollTrigger: {
            trigger: '.projects',
            pin: ".pin-prj", // pin the trigger element while active
            pinSpacing: true,
            start: 'top top', // when the top of the trigger hits the top of the viewport
            end: '+=3500', // end after scrolling 500px beyond the start
            scrub: .5, // smooth scrubbing, takes 1 second to "catch up" to the scrollbar
        }
    })
})
</script>

<template>
    <div class="pin-prj">
        <section class="projects">
            <div class="projects__header">Selected Projects.</div>
        </section>
    </div>
</template>

<style lang="scss" scoped>

.projects {
    height: 1000px;
    display: flex;
    flex-flow: column;
    font-family: $sans-text;
    gap: 20px;
    bottom: 20px;
    color: $secondary;

    &__header {
        font-size: clamped(46px, 100px, 380px, 1920px);
        font-weight: 700;
        line-height: .9;
    }
}
</style>