<script setup lang="ts">
import SplitType from 'split-type';
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const { data } = await useAsyncGql({
    operation: 'projects'
});

const { $gsap } = useNuxtApp()

onMounted(async () => {
    $gsap.registerPlugin(ScrollTrigger)

    let pt = $gsap.timeline({
        scrollTrigger: {
            trigger: '.pin-intro',
            pin: ".pin-intro", // pin the trigger element while active
            pinSpacing: false,
            start: 'top top', // when the top of the trigger hits the top of the viewport
            endTrigger: ".projects",
            end: 'bottom bottom',
            scrub: 1,
            //markers: { startColor: "black", endColor: "orange", fontSize: "18px", fontWeight: "bold", indent: 20 }
        }
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
            filter: 'blur(50px)',
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
            <div class="prj-intro__header split">Selected Projects.</div>
        </section>
    </div>

    <div class="projects">
        <div v-for="proj in data.projects" :key="proj.id">
            <div class="projects__proj">
                <NuxtImg class="unblur" :src="proj.image[0].handle" provider="hygraph" alt="Project image" format="webp"
                    sizes="sm:100vw md:50vw lg:40svw" densities="x1 x2"></NuxtImg>
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
    background-color: $primary;
    z-index: 100
}

.prj-intro {
    display: flex;
    flex-flow: column;
    gap: 20px;
    bottom: 20px;
    font-family: $sans-text;
    color: $secondary;
    background-color: #E7F6F2;
    margin: 0px 0 50px 0;
    padding-top:20px;

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
    background-color: #E7F6F2;
    align-self: flex-start;
    overflow: hidden;

    &__name {
        font-family: $sans-text;
        color: $secondary;
        font-weight: 600;
        font-size: clamped(15px, 30px, 380px, 1920px);
    }

    &__tags {
        font-family: $sans-text;
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