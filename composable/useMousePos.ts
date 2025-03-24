// mouse.js
import { ref, onMounted, onUnmounted } from 'vue'

const xpos = ref<number>()
const ypos = ref<number>()

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