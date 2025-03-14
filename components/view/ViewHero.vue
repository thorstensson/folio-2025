<script setup lang="ts">
import type { ComponentPublicInstance } from 'vue';
import * as PIXI from 'pixi.js';
import { Application, Text, Assets, Sprite, DisplacementFilter } from 'pixi.js';
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const { data } = await useAsyncGql({
    operation: 'author'
});

const { $gsap } = useNuxtApp()

const pixiCtx = useTemplateRef<any>('pixi')
const logoEl = useTemplateRef<any>('mylogo')
const titleEl = useTemplateRef<any>('title')

onMounted(async () => {
    $gsap.registerPlugin(ScrollTrigger)

    $gsap.set(logoEl.value, { alpha: 0 })
    const app = new PIXI.Application()

    // Initialize the application
    app.init({ background: '#E7F6F2', canvas: pixiCtx.value })

    const image = await Assets.load('/thelogo.png')
    const logo = PIXI.Sprite.from(image)
    const displacer = await Assets.load('/displacemap.png')
    const ripple = PIXI.Sprite.from(displacer);

    app.stage.addChild(logo)
    app.stage.addChild(ripple)

    const filter = new DisplacementFilter(ripple)
    app.stage.filters = [filter]
    app.stage.filterArea = app.screen;

    logo.anchor.set(0.5);
    logo.position.set(pixiCtx.value.width / 2, pixiCtx.value.height / 2)

    ripple.anchor.set(0.5)
    ripple.scale.set(0.05)
    ripple.position.set(pixiCtx.value.width / 2, pixiCtx.value.height / 2)

    filter.scale.set(100);

    //set a pulse
    $gsap.to(logoEl.value, { duration: 1, alpha: 1 })
    let tl = $gsap.timeline({ repeat: 1 });
    tl.to(ripple.scale, { duration: 1.5, x: 1.5, y: 1.5 }, "ripple")
        .to(filter.scale, { duration: 1.5, x: 0, y: 0 }, "ripple")

    // set scrolltriggers

    let st = $gsap.timeline({
        // yes, we can add it to an entire timeline!
        scrollTrigger: {
            trigger: '.logo',
            pinSpacing: false,
            start: 'top top', // when the top of the trigger hits the top of the viewport
            end: '+=500', // end after scrolling 500px beyond the start
            scrub: .5, // smooth scrubbing, takes 1 second to "catch up" to the scrollbar
        }
    });

    st.addLabel('start')
        .fromTo(logoEl.value, { opacity: 1 }, { opacity: 0.2 }, "ripple")
        .fromTo(titleEl.value, { opacity: 1 }, { opacity: 0 }, "ripple")
        .fromTo(ripple.scale, { x: 0, y: 0 }, { x: 5.5, y: 5.5 }, "ripple")
        .to(filter.scale, { x: 5.5, y: 5.5 }, "ripple")

})

</script>

<template>
    <div class="pin">
        <section class="logo" ref="mylogo">
            <canvas class="logo__pixi" ref="pixi">test</canvas>
        </section>
    </div>
    <section class="title" aria-label="Quick summary" ref="title">
        <div class="title__header">{{ data.author?.name }}.</div>
        <div class="title__intro">{{ data.author?.intro }}</div>
    </section>
</template>

<style lang="scss" scoped>
.pin {
    height: 100vh
}

.logo {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;

    &__pixi {
        width: clamp(300px, 40vw, 600px);
        height: auto;
        background-color: $primary ;
    }
}

.title {
    display: flex;
    flex-flow: column;
    font-family: $sans-text;
    position: fixed;
    gap: 20px;
    bottom: 20px;
    color: $secondary;

    &__header {
        font-size: clamped(46px, 130px, 480px, 1920px);
        font-weight: 700;
        line-height: .9;
    }

    &__intro {
        font-size: 18px;
        font-weight: 400;
        max-width: 500px;
    }
}
</style>