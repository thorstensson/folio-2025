<script setup lang="ts">
import * as THREE from 'three'
import type { ComponentPublicInstance } from 'vue';

const { x: mousePosX, y: mousePosY } = useMouse()

const props = defineProps<{ imgElm: any, contElm: HTMLElement }>()
const { imgElm, contElm } = toRefs(props)

let planeMesh: THREE.Mesh
let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer

let easeFactor = 0.02;
let mousePosition = { x: 0.5, y: 0.5 };
let targetMousePosition = { x: 0.5, y: 0.5 };
let mouseStopTimeout;
let aberrationIntensity = 0.0;
let lastPosition = { x: 0.5, y: 0.5 };
let prevPosition = { x: 0.5, y: 0.5 };

// shaders
const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

const fragmentShader = `
    varying vec2 vUv;
    uniform sampler2D u_texture;    
    uniform vec2 u_mouse;
    uniform vec2 u_prevMouse;
    uniform float u_aberrationIntensity;

    void main() {
        vec2 gridUV = floor(vUv * vec2(20.0, 20.0)) / vec2(20.0, 20.0);
        vec2 centerOfPixel = gridUV + vec2(1.0/20.0, 1.0/20.0);
        
        vec2 mouseDirection = u_mouse - u_prevMouse;
        
        vec2 pixelToMouseDirection = centerOfPixel - u_mouse;
        float pixelDistanceToMouse = length(pixelToMouseDirection);
        float strength = smoothstep(0.3, 0.0, pixelDistanceToMouse);
 
        vec2 uvOffset = strength * - mouseDirection * 0.2;
        vec2 uv = vUv - uvOffset;

        vec4 colorR = texture2D(u_texture, uv + vec2(strength * u_aberrationIntensity * 0.01, 0.0));
        vec4 colorG = texture2D(u_texture, uv);
        vec4 colorB = texture2D(u_texture, uv - vec2(strength * u_aberrationIntensity * 0.01, 0.0));

        gl_FragColor = vec4(colorR.r, colorG.g, colorB.b, 1.0);

        
    }
`;

const initializeScene = (texture: any) => {
    //   scene creation
    scene = new THREE.Scene();

    // camera setup
    camera = new THREE.PerspectiveCamera(
        80,
        imgElm.value.$el.offsetWidth / imgElm.value.$el.offsetHeight,
        0.01,
        10
    );

    camera.position.z = 1;

    //   uniforms
    let shaderUniforms = {
        u_mouse: { type: "v2", value: new THREE.Vector2() },
        u_prevMouse: { type: "v2", value: new THREE.Vector2() },
        u_aberrationIntensity: { type: "f", value: 0.0 },
        u_texture: { type: "t", value: texture }
    };

    //   creating a plane mesh with materials
    planeMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(2, 2),
        new THREE.ShaderMaterial({
            uniforms: shaderUniforms,
            vertexShader,
            fragmentShader,
            transparent: true,
        })
    );

    //   add mesh to scene
    scene.add(planeMesh);

    //   render
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(imgElm.value.$el.offsetWidth, imgElm.value.$el.offsetHeight);
    renderer.setClearColor( 0xE7F6F2, 0 ); // the default

    //   create a canvas
    contElm.value.appendChild(renderer.domElement);
}

const animateScene = () => {
    requestAnimationFrame(animateScene);

    mousePosition.x += (targetMousePosition.x - mousePosition.x) * easeFactor;
    mousePosition.y += (targetMousePosition.y - mousePosition.y) * easeFactor;

    (planeMesh.material as THREE.ShaderMaterial).uniforms.u_mouse.value.set(
        mousePosition.x,
        1.0 - mousePosition.y
    );

    (planeMesh.material as THREE.ShaderMaterial).uniforms.u_prevMouse.value.set(
        prevPosition.x,
        1.0 - prevPosition.y
    );

    aberrationIntensity = Math.max(0.0, aberrationIntensity - 0.05);

    (planeMesh.material as THREE.ShaderMaterial).uniforms.u_aberrationIntensity.value = aberrationIntensity;

    renderer.render(scene, camera);
}

const handleMouseMove = (e) => {
    easeFactor = 0.02;
    let rect = contElm.value.getBoundingClientRect();
    prevPosition = { ...targetMousePosition };

    targetMousePosition.x = (e.clientX - rect.left) / rect.width;
    targetMousePosition.y = (e.clientY - rect.top) / rect.height;

    aberrationIntensity = 1;
}

const handleMouseEnter = (e) => {
    easeFactor = 0.02;
    let rect = contElm.value.getBoundingClientRect();
    mousePosition.x = targetMousePosition.x = (e.clientX - rect.left) / rect.width;
    mousePosition.y = targetMousePosition.y = (e.clientY - rect.top) / rect.height;
}

const handleMouseLeave = () => {
    easeFactor = 0.05;
    targetMousePosition = { ...prevPosition };
}

onMounted(() => {
    // use the existing image from html in the canvas
    initializeScene(new THREE.TextureLoader().load(imgElm.value.$el.src));
    animateScene();

    contElm.value.addEventListener("mousemove", handleMouseMove);
    contElm.value.addEventListener("mouseenter", handleMouseEnter);
    contElm.value.addEventListener("mouseleave", handleMouseLeave);
})

</script>

<template>
    <div>

    </div>
</template>

<style lang="scss" scoped>
canvas {
  display: block;
}
</style>