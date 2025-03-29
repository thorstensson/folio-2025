<script setup lang="ts">
import { useMousePos } from "~/composable/useMousePos"

const { xpos, ypos } = useMousePos()
const { $gsap } = useNuxtApp()

const text = useTemplateRef<HTMLHtmlElement>("text")
const shape = useTemplateRef<HTMLHtmlElement>("shape")
const dataName = ref<string>("")
const isOver = ref<boolean>(false)
const bgColor = ref<string>("")
const dispStr = ref<string>("")

const loopStarted = ref<boolean>(false)
const pos = { x: 0, y: 0 }
const vel = { x: 0, y: 0 }

const route = useRoute();

//TODO : Cleanup
onMounted(() => {
    // A little ugly with a watcher inside route but Jelly am I and I need to know what is on the next route! Jelly, I am.
    watch(route, value => {

        let sections = $gsap.utils.toArray(".action")

        sections.forEach((sec: any) => {
            sec.addEventListener("mouseover", () => {
                isOver.value = true
                dataName.value = sec.dataset.name
                bgColor.value = "#f4f3ee"
                dispStr.value = sec.dataset.vis
            })

            sec.addEventListener("mouseout", () => {
                isOver.value = false
                dataName.value = ""
                bgColor.value = "#1E201E"
                dispStr.value = "block"
            })

            sec.addEventListener("click", () => {
                isOver.value = false
                dataName.value = ""
                bgColor.value = "#1E201E"
                dispStr.value = "block"
            })
        })

    }, { deep: true, immediate: true })

    const setFromEvent = () => {
        let x = xpos.value
        let y = ypos.value
        $gsap.to(pos, {
            x: x,
            y: y,
            ease: "power4.out",
            duration: 0.2,
            onUpdate: () => {
                vel.x = x! - pos.x
                vel.y = y! - pos.y
            },
        })

        if (!loopStarted.value) {
            $gsap.ticker.add(loop)
        }
    }

    const loop = () => {
        // Calculate angle and scale based on velocity
        let rotation = getAngle(vel.x, vel.y)
        let scale = getScale(vel.x, vel.y)

        // Set transform data to Jelly Blob
        $gsap.to(shape.value, {
            x: Math.round(pos.x - shape.value!.getBoundingClientRect().width / 2),
            y: Math.round(pos.y - shape.value!.getBoundingClientRect().height / 2),
            //rotation: rotation + "_short",
            scaleX: 1 + scale,
            scaleY: 1 - scale,
            duration: 0.0,
        })
    }

    //The Blob! Thanks to https://codepen.io/GreenSock/pen/YzQabVQ
    const getScale = (diffX: number, diffY: number) => {
        const distance = Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2))
        return Math.min(distance / 100, 0.2)
    }

    const getAngle = (diffX: number, diffY: number) => {
        return (Math.atan2(diffY, diffX) * 180) / Math.PI
    }

    watch(
        () => [xpos.value, ypos.value],
        ([newXpos, newYpos], [prevXpos, prevYpos]) => {
            setFromEvent()
        }
    )
})
</script>

<template>
    <div class="cursor" :style="{ display: dispStr }">
        <div class="cursor__shape" :style="{ backgroundColor: bgColor }" :class="{ 'cursor__shape--over': isOver }"
            ref="shape">
            <div class="cursor__shape__text" :class="{ 'cursor__shape__text--on': isOver }" ref="text">
                {{ dataName }} <i />
            </div>
            <div class="media"></div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.cursor {
    font-family: $sans-ui;
    font-weight: 400;
    font-size: 14px;
    position: fixed;
    z-index: 9000;
    width: 100%;
    opacity: 0.9;

    &__shape {
        display: flex;
        align-items: center;
        justify-content: center;
        ;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        width: 20px;
        height: 20px;
        border: 1px solid $accent1;
        border-radius: 50%;
        pointer-events: none;
        background-color: $secondary;
        transform-origin: center center;
        will-change: width, height, transform, border;
        transition: all 0.4s cubic-bezier(0.075, 0.82, 0.165, 1);

        &--over {
            border-radius: 50px;
            width: 100px;
            height: 50px;
        }

        &__text {
            display: flex;
            color: $secondary;
            align-items: center;
            justify-content: center;
            backface-visibility: hidden;
            transform: translateZ(0);
            -webkit-text-size-adjust: 100%;
            text-rendering: optimizeLegibility;
            white-space: nowrap;

            &--on i::after {
                color: black;
                content: "\2197";
                font-size: 20px;
            }
        }
    }
}
</style>
