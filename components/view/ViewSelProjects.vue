<script setup lang="ts">
import SplitType from 'split-type';
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useHomeStore } from '~/store/useHomeStore'

// PINIA 🍍 
const store = useHomeStore()

const { $gsap } = useNuxtApp()

onMounted(async() => {
    $gsap.registerPlugin(ScrollTrigger)

    let pt = $gsap.timeline({
        scrollTrigger: {
            trigger: '.pin-intro',
            pin: ".pin-intro", // pin the trigger element while active
            pinSpacing: false,
            start: 'top top', // when the top of the trigger hits the top of the viewport
            endTrigger: ".projects",
            end: 'bottom bottom',
            scrub: 1
            //markers: { startColor: "black", endColor: "orange", fontSize: "18px", fontWeight: "bold", indent: 20 }
        }
    })
    // Reveal and unreveal text thanks youtube
    let sectionsChar = $gsap.utils.toArray('.split-char');
    sectionsChar.forEach((sec: any) => {
        const splitTxt = new SplitType(sec, { types: 'chars' })
        $gsap.from(splitTxt.chars, {
            autoAlpha: 0,
            y: +20,
            scrollTrigger: {
                trigger: sec,
                start: 'top 80%',
                scrub: false,
                end: 'top 20%',
                toggleActions: "play none none reverse",
            },
            transformOrigin: 'top',
            stagger: .1,
            duration: .2
        })
    })


    // Reveal and unreveal text thanks youtube
    let sections = $gsap.utils.toArray('.split');
    sections.forEach((sec: any) => {
        const splitTxt = new SplitType(sec, { types: 'words' })
        $gsap.from(splitTxt.words, {
            autoAlpha: 0,
            y: +20,
            scrollTrigger: {
                trigger: sec,
                start: 'top 80%',
                scrub: false,
                end: 'top 20%',
                toggleActions: "play none none reverse",
            },
            transformOrigin: 'top',
            stagger: .1,
            duration: .2
        })
    })

    let images = $gsap.utils.toArray('.unblur');
    images.forEach((img: any) => {
        $gsap.from(img, {
            opacity: 0,
            filter: 'blur(20px)',
            scrollTrigger: {
                trigger: img,
                start: 'top 80%',
                scrub: false,
                end: 'top 20%',
                toggleActions: "play none none reverse",
            },
            transformOrigin: 'top',
            stagger: .1,
            duration: .6
        })
    })

})
</script>

<template>
    <div class="pin-intro">
        <section class="prj-intro">
            <div class="prj-intro__header split-char">Selected Projects.</div>
        </section>
    </div>

    <div class="projects">
        <div v-for="proj in store.data?.projects" :key="proj.slug">
            <div class="projects__proj action" data-name="View me" data-color="#FFF">
                <NuxtLink :to="`/projects/${proj.slug}`">
                    <NuxtImg class="unblur" :src="proj.image[0].handle" provider="hygraph" alt="Project image"
                        format="webp" sizes="sm:100vw md:50vw lg:40svw" densities="x1 x2"></NuxtImg>
                </NuxtLink>
            </div>
            <div class="projects__name split">{{ proj.name }}</div>
            <div class="projects__tags split">{{ proj.tags }}</div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.split {
    -webkit-font-kerning: none;
    font-kerning: none;
}

.pin-intro {
    transform: initial;
    scroll-snap-align: start;
    z-index: 100;
    backdrop-filter: blur(20px);
    -webkit-mask-image: linear-gradient(0deg, rgba(255, 255, 255, 0) 0%, $primary 20%, $primary 100%);
    mask-image: linear-gradient(0deg, rgba(255, 255, 255, 0) 0%, $primary 20%, $primary 100%);
}

.prj-intro {
    scroll-snap-align: start;
    transform: initial;
    display: flex;
    flex-flow: column;
    gap: 20px;
    bottom: 20px;
    color: $secondary;
    margin: 0px 0 30px 0;
    padding-top: 20px;
    font-family: $serif-head;

    &__header {
        font-size: clamped(46px, 100px, 380px, 1920px);
        font-weight: 600;
        line-height: .9;
    }
}

.projects {
    display: flex;
    flex-direction: column;
    gap: 100px;
    width: 100%;
    background-color: $primary;
    align-self: flex-start;
    overflow: hidden;

    &__proj {
        filter: grayscale(50%) sepia(10%) saturate(76%);
        -webkit-filter: grayscale(50%) sepia(10%) saturate(76%);
        -moz-filter: grayscale(50%) sepia(10%) saturate(76%);
    }

    &__name {
        color: $secondary;
        font-weight: 600;
        font-size: clamped(15px, 30px, 380px, 1920px);
        font-family: $serif-head;
    }

    &__tags {
        color: $secondary;
    }

    @include this-and-above('md') {
        :nth-child(odd) {
            align-self: flex-end;
        }

        :nth-child(even) {
            align-self: flex-start;
        }
    }
}
</style>