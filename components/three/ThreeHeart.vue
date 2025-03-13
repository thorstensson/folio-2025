<script setup lang="ts">
import { useParentElement } from '@vueuse/core'
import * as THREE from 'three'

const mycanvas = useTemplateRef('canvas')
const parentEl = useParentElement()

const extrudeSettings = {
    depth: 8,
    bevelEnabled: true,
    bevelSegments: 2,
    steps: 2,
    bevelSize: 1,
    bevelThickness: 1
}

let camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer, scene: THREE.Scene, mesh: THREE.Mesh

onMounted(() => {
    let objHeight = parentEl.value!.clientHeight
    let objWidth = parentEl.value!.clientWidth

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, canvas: mycanvas.value as HTMLCanvasElement })
    renderer.xr.enabled = true
    renderer.setClearColor(0x0C0C0C)

    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 100
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(objWidth, objHeight)
    renderer.setAnimationLoop(animate)

    camera = new THREE.PerspectiveCamera(70, objWidth / objHeight, 1, 1000)
    camera.position.set(0, 1.3, .7)

    scene = new THREE.Scene()

    const heartShape = new THREE.Shape()

    heartShape.moveTo(25, 25)
    heartShape.bezierCurveTo(25, 25, 20, 0, 0, 0)
    heartShape.bezierCurveTo(- 30, 0, - 30, 35, - 30, 35)
    heartShape.bezierCurveTo(- 30, 55, - 10, 77, 25, 95)
    heartShape.bezierCurveTo(60, 77, 80, 55, 80, 35)
    heartShape.bezierCurveTo(80, 35, 80, 0, 50, 0)
    heartShape.bezierCurveTo(35, 0, 25, 25, 25, 25)

    const geometry = new THREE.ExtrudeGeometry(heartShape, extrudeSettings)
    geometry.center()

    mesh = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial({color:0xF2613F}) )
    mesh.name = 'heart'
    mesh.position.y = 30
    mesh.position.z = - 200
    scene.add(mesh)

    const light = new THREE.DirectionalLight(0x222222, 3)
    light.position.set(1, 1, 1)
    scene.add(light)

    window.addEventListener('resize', onWindowResize)
    window.addEventListener("deviceorientation", onWindowResize)
})

const onWindowResize = () => {
    let objHeight = parentEl.value!.clientHeight
    let objWidth = parentEl.value!.clientWidth
    camera.aspect = objWidth / objHeight
    camera.updateProjectionMatrix()
    renderer.setSize(objWidth, objHeight)
}

const animate = () => {
    const time = performance.now() * 0.0002
    const heart3d = scene.getObjectByName('heart')
    heart3d!.rotation.x = time * 0.4
    heart3d!.rotation.y = time
    renderer.render(scene, camera)
}
</script>

<template>
    <canvas class="canvas" ref="canvas" />
</template>

<style scoped lang="scss">
.canvas {
    /*it seems three calculates a few pixels off on some resizes so we force height gulp*/
    height: 100% !important;
    border: none;
}
</style>