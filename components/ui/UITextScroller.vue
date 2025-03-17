<script setup lang="ts">
import { useParentElement } from '@vueuse/core'

const props = defineProps<{
    text?: string,
    speed?: string
}>()

const { $gsap } = useNuxtApp()
const parentEl = useParentElement()

//TODO: Ok so TYpeScript / ESLint is finding some 'any' types, fix when have time
onNuxtReady(() => {

    if (!process.client) return

    /**
     * Code below comes straight from $gsap docs, because they solved horizontal text scrolling, need more than CSS here.
     * This is where I draw a penguin for win: thanks, GSAP team.
     * @see https://$gsap.com/community/forums/topic/42921-horizontal-infinite-text-loop-without-empty-spaces/
     * @param items b
     * @param config 
     */

    /*
    This GSAP helper function makes a group of elements animate along the x-axis in a seamless, responsive loop.
    
    Features:
     - Uses xPercent so that even if the widths change (like if the window gets resized), it should still work in most cases.
     - When each item animates to the left or right enough, it will loop back to the other side
     - Optionally pass in a config object with values like "speed" (default: 1, which travels at roughly 100 pixels per second), paused (boolean),  repeat, reversed, and paddingRight.
     - The returned timeline will have the following methods added to it:
       - next() - animates to the next element using a timeline.tweenTo() which it returns. You can pass in a vars object to control duration, easing, etc.
       - previous() - animates to the previous element using a timeline.tweenTo() which it returns. You can pass in a vars object to control duration, easing, etc.
       - toIndex() - pass in a zero-based index value of the element that it should animate to, and optionally pass in a vars object to control duration, easing, etc. Always goes in the shortest direction
       - current() - returns the current index (if an animation is in-progress, it reflects the final index)
       - times - an Array of the times on the timeline where each element hits the "starting" spot. There's also a label added accordingly, so "label1" is when the 2nd element reaches the start.
     */
    const factor = (parentEl.value!.clientWidth < 992) ? 3 : 6
    const scrollingText = $gsap.utils.toArray('.rail h4')

    const tl = horizontalLoop(scrollingText, {
        repeat: -1,
    })

    $gsap.timeline({
        defaults: {
            ease: "none",
        }
    })
        .to(tl, { timeScale: factor * 2.5, duration: 0.2 })
        .to(tl, { timeScale: factor / 2.5, duration: 1 }, "+=0.3")

    function horizontalLoop(items, config) {
        items = $gsap.utils.toArray(items)
        config = config || {}
        let tl = $gsap.timeline({ repeat: config.repeat, paused: config.paused, defaults: { ease: "none" }, onReverseComplete: () => tl.totalTime(tl.rawTime() + tl.duration() * 100) }),
            length = items.length,
            startX = items[0].offsetLeft,
            times = [],
            widths = [],
            xPercents = [],
            curIndex = 0,
            pixelsPerSecond = (props.speed || 1) * 100,
            snap = config.snap === false ? v => v : $gsap.utils.snap(config.snap || 1), // some browsers shift by a pixel to accommodate flex layouts, so for example if width is 20% the first element's width might be 242px, and the next 243px, alternating back and forth. So we snap to 5 percentage points to make things look more natural
            totalWidth, curX, distanceToStart, distanceToLoop, item, i;
        $gsap.set(items, { // convert "x" to "xPercent" to make things responsive, and populate the widths/xPercents Arrays to make lookups faster.
            xPercent: (i, el) => {
                let w = widths[i] = parseFloat($gsap.getProperty(el, "width", "px"));
                xPercents[i] = snap(parseFloat($gsap.getProperty(el, "x", "px")) / w * 100 + $gsap.getProperty(el, "xPercent"))
                return xPercents[i]
            }
        });
        $gsap.set(items, { x: 0 })
        totalWidth = items[length - 1].offsetLeft + xPercents[length - 1] / 100 * widths[length - 1] - startX + items[length - 1].offsetWidth * $gsap.getProperty(items[length - 1], "scaleX") + (parseFloat(config.paddingRight) || 0);
        for (i = 0; i < length; i++) {
            item = items[i]
            curX = xPercents[i] / 100 * widths[i]
            distanceToStart = item.offsetLeft + curX - startX
            distanceToLoop = distanceToStart + widths[i] * $gsap.getProperty(item, "scaleX")
            tl.to(item, { xPercent: snap((curX - distanceToLoop) / widths[i] * 100), duration: distanceToLoop / pixelsPerSecond }, 0)
                .fromTo(item, { xPercent: snap((curX - distanceToLoop + totalWidth) / widths[i] * 100) }, { xPercent: xPercents[i], duration: (curX - distanceToLoop + totalWidth - curX) / pixelsPerSecond, immediateRender: false }, distanceToLoop / pixelsPerSecond)
                .add("label" + i, distanceToStart / pixelsPerSecond)
            times[i] = distanceToStart / pixelsPerSecond
        }

        function toIndex(index, vars) {
            vars = vars || {}
                (Math.abs(index - curIndex) > length / 2) && (index += index > curIndex ? -length : length); // always go in the shortest direction
            let newIndex = $gsap.utils.wrap(0, length, index),
                time = times[newIndex]
            if (time > tl.time() !== index > curIndex) { // if we're wrapping the timeline's playhead, make the proper adjustments
                vars.modifiers = { time: $gsap.utils.wrap(0, tl.duration()) }
                time += tl.duration() * (index > curIndex ? 1 : -1)
            }
            curIndex = newIndex
            vars.overwrite = true
            return tl.tweenTo(time, vars)
        }
        tl.next = vars => toIndex(curIndex + 1, vars)
        tl.previous = vars => toIndex(curIndex - 1, vars)
        tl.current = () => curIndex
        tl.toIndex = (index, vars) => toIndex(index, vars)
        tl.times = times
        tl.progress(1, true).progress(0, true) // pre-render for performance
        if (config.reversed) {
            tl.vars.onReverseComplete()
            tl.reverse()
        }
        return tl
    }

})
</script>

<template>
    <div class="wrapper">
        <div class="rail">
            <h4 v-html="text"></h4>
            <h4 v-html="text"></h4>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.wrapper {
    overflow: hidden;
    width: 100%;
    height: -moz-fit-content;
    height: fit-content;
    align-items: center;
    padding: 200px 0 200px 1px;
}

.rail {
    display: flex;

    h4 {
        white-space: pre;
        line-height: 1em;
        margin: 0 2rem 0 0;
        font-family: $sans-text;
        color: $secondary;
        font-family: $sans-text;
        font-weight: 600;
        font-size: clamped(100px, 200px, 480px, 1920px);
        will-change: transform;
        text-transform: uppercase;

        :deep(.outline) {
            color: $primary;

            /* Text Shadow Property */
            text-shadow: -4px -4px 0 $secondary, 4px -4px 0 $secondary, 4px 4px 0 $secondary,
                4px 4px 0 $secondary;
        }
    }
}
</style>
