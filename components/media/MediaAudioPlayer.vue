<script setup lang="ts">
/**
 * An even more slimmed down version of the player.
 * TODO: when portfolio is done, revisit this for improvements
 * (should I use Audio class, load server side?)
 */

import { ref, useTemplateRef, reactive, watch, onMounted, computed } from 'vue'

import { useStoreRef } from '@/composable/useStoreRef'

const spectrum = useTemplateRef('spectrum')
const audioEl = useTemplateRef('audio-element')
const trackTime = ref<string>("00:00")
const trackDuration = ref<string>("00.00")
const trackIndex = ref<number>(0)
const currentTrack = ref<string>("")
const isPlaying = ref<boolean>(false)

const doPlay = ref<boolean>(false)
const title = ref<string>("Sound")

const PATH = useRuntimeConfig().public.s3Path


//Add tracks here; no plans to make a DOM playlist
const playlist = reactive([

    { artist: "Oneheart", track: "Øneheart, Antent, Dean Korso - silence is speaking.mp3" },
    
    { artist: "Ashess", track: "ashess - she is the moment.mp3" },

    { artist: "Shibíre", track: "shibíre - Hometown.mp3" }

])

// Check for remaining tracks
const ifTrackNext = computed(() => {
    return trackIndex.value < playlist.length - 1
})

const ifTrackPrev = computed(() => {
    return trackIndex.value > 0
})

// Check for current track
const currTrack = computed(() => {
    return playlist[trackIndex.value].track
})

const togglePlay = () => {
    isPlaying.value = !isPlaying.value
    if (isPlaying.value && audioEl.value) {
        playTrack()
    } else if (audioEl.value) {
        audioEl.value.pause()
    }
}

// For previous and next we need to know if track is playing when we press them
const nextTrack = () => {
    if (ifTrackNext.value && !isPlaying.value) {
        trackIndex.value++
        currentTrack.value = currTrack.value
    } else if (ifTrackNext.value) {
        isPlaying.value = true
        trackIndex.value++
        playTrack()
    }
}

const prevTrack = () => {
    if (ifTrackPrev.value && !isPlaying.value) {
        trackIndex.value--
        currentTrack.value = currTrack.value
    } else if (ifTrackPrev.value) {
        isPlaying.value = true
        trackIndex.value--
        playTrack()
    }
}

const playTrack = () => {
    // Vueuse, easy cancel. oncanplaythrough does not work on mobile, loadedmetadata does???
    const cancelcan = useEventListener(
        audioEl.value as unknown as MaybeRef,
        "loadedmetadata",
        () => {
            audioEl.value?.play()
            cancelcan()
        }
    )
    // Synchronous, so we do this after adding event
    isPlaying.value = true
    audioEl.value!.currentTime = 0
    currentTrack.value = currTrack.value
    audioEl.value?.load()
}

// E from v-on listener
const timeUpdate = () => {
    setTimes()
}

// Times, leaving this in, in case you want to use
const setTimes = () => {
    const m = ('0' + Math.floor((audioEl.value!.currentTime / 60) % 60)).slice(
        -2
    )
    const s = ('0' + Math.floor(audioEl.value!.currentTime % 60)).slice(-2)
    trackTime.value = `${m}:${s}`
}

// E from v-on listener, leaving this in, in case you want to use
const durationUpdate = () => {
    const m = ("0" + Math.floor((audioEl.value!.duration / 60) % 60)).slice(-2)
    const s = ("0" + Math.floor(audioEl.value!.duration % 60)).slice(-2)
    trackDuration.value = `${m}:${s}`
}

const onTrackEnded = () => {
    if (ifTrackNext.value && spectrum.value) {
        trackIndex.value++
        playTrack()
    } else if (audioEl.value && spectrum.value) {
        trackIndex.value = 0
        audioEl.value.pause()
        audioEl.value.currentTime = 0
        currentTrack.value = currTrack.value
        // we have played 'all' tracks set model value false
        doPlay.value = false;
    }
}

// Watch our v-model for update of checked ref
watch(() => doPlay.value, (newValue, oldValue) => {
    togglePlay();
})

onMounted(() => {
    const { addElem } = useStoreRef()
    addElem("audioEl", audioEl)
    currentTrack.value = currTrack.value
})

</script>

<template>
    <div class="player-wrapper">
        <audio type="audio/mp3" :src="`${PATH}/${currentTrack}`" preload="auto" v-on:timeupdate="timeUpdate"
            v-on:durationchange="durationUpdate" v-on:ended="onTrackEnded" ref="audio-element"></audio>
        <div class="controls">
            <UIAudioToggle v-model="doPlay" :title />
        </div>
        <div v-if="audioEl">
            <MediaAudioVisualizer ref="spectrum" />
        </div>
    </div>
</template>

<style lang="scss" scoped>
body {
    -webkit-overflow-scrolling: none;
    overflow: hidden;
    overscroll-behavior: none;
}

.player-wrapper {
    width: 240px;
    height: 70px;
    -webkit-overflow-scrolling: none;
    overflow: hidden;
    overscroll-behavior: none;
}

.controls {
    height: inherit;
    width: inherit;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: flex-end;
}
</style>
