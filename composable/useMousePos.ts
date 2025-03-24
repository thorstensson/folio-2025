// mouse.js
import { ref, onMounted, onUnmounted } from 'vue'

const xpos = ref<number>()
const ypos = ref<number>()
const xdir = ref<string>('')
const ydir = ref<string>('')
const lastPoint = { x: 0, y: 0 }

export function useMousePos() {

  const update = (e: MouseEvent) => {
    xpos.value = e.clientX
    ypos.value = e.clientY
  }

  if (import.meta.client) {
    onMounted(() => window.addEventListener('mousemove', update))
    onUnmounted(() => window.removeEventListener('mousemove', update))
  }

  // expose managed state as return value
  return { xpos, ypos }
}