<script setup lang="ts">
import { useEventListener } from '@vueuse/core'
import { useStoreRef } from '@/composable/useStoreRef'

const canvas = useTemplateRef<HTMLCanvasElement>('canvas')
const analyser = ref<AnalyserNode>()

let ctx: CanvasRenderingContext2D
let myReq: number
let barWidth: number
let audioCtx: AudioContext
let dataArray: Uint8Array
let bufferLength: number

// Use our Composable to get the audio element from the Record
const { getElem } = useStoreRef()
const { sRef: audioEl } = getElem('audioEl')

/**
 * Use web audio API to get the total number of data points available
 * to the AudioContext sampleRate.
 */
const createAnalyserData = () => {
    audioCtx = new AudioContext()
    const audioSrc = audioCtx.createMediaElementSource(audioEl.value as HTMLMediaElement)

    analyser.value = audioCtx.createAnalyser()
    audioSrc.connect(analyser.value)
    analyser.value.connect(audioCtx.destination)
    analyser.value.fftSize = 64

    bufferLength = analyser.value.frequencyBinCount
    dataArray = new Uint8Array(bufferLength)

    if (audioCtx.state === 'suspended') {
        audioCtx.resume()
    }
    barWidth = 10
}

/**
 * MDN: The getByteFrequencyData() method of the AnalyserNode interface copies
 * the current frequency data into a Uint8Array (unsigned byte array) passed into it.
 * The frequency data is composed of integers on a scale from 0 to 255.
 * Each item in the array represents the decibel value for a specific frequency.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode/getByteFrequencyData|MDN}
 */
const startAnimRequest = () => {
    function draw() {
        let x = 5
        if (canvas.value && ctx) {
            ctx.clearRect(0, 0, canvas.value.width, canvas.value.height)
            analyser.value?.getByteFrequencyData(dataArray)
            for (let i = 0; i < bufferLength; i++) {
                const barHeight = dataArray[i]
                ctx.fillStyle = `rgb(${barHeight + 72} 30 20)`
                ctx.fillRect(x, canvas.value.height - barHeight, barWidth, barHeight)
                x += barWidth +2
            }
        }
        myReq = requestAnimationFrame(draw)
    }
    draw()
}

const cancelAnimRequest = () => {
    setTimeout(() => {
        cancelAnimationFrame(myReq)
    }, 800)
}

onMounted(() => {
    if (canvas.value) ctx = canvas.value.getContext('2d')!

    audioEl.value?.addEventListener('playing', startAnimRequest)
    audioEl.value?.addEventListener('paused', cancelAnimRequest)

    // One time event to create onetime AudioContext
    const cleanup = useEventListener(document, 'mousedown', () => {
        cleanup()
        createAnalyserData()
    })
})

</script>

<template>
    <div class="canvas-wrapper">
        <canvas id="canvas" ref="canvas"></canvas>
    </div>
</template>

<style scoped lang="scss">
#canvas {
    bottom: 26px;
    position: absolute;
    width: 100px;
    height: 25px;
    -webkit-user-select: none;
    -moz-user-select: none;
    user-select: none;
    right: 56px;
}
</style>
