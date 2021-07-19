<template>
    <router-view />
</template>

<script>
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'
import callServer from './callServer'
import store from './store'
import { sleep } from './utils'
export default {
    setup() {
        let router = useRouter()
        onMounted(async () => {
            if (localStorage.getItem('player')) {
                let player = await callServer('getPlayer', {
                    id: localStorage.getItem('player')
                })
                if (player?._id) {
                    store.player = player
                    router.push({ name: 'Game' })
                } else {
                    router.push({ name: 'Home' })
                }
            }
        })
    }
}
</script>

<style>
@font-face {
    font-family: PixelMain;
    src: url(assets/pixel-font.ttf);
}
* {
    font-family: PixelMain;
    image-rendering: pixelated;
    image-rendering: -moz-crisp-edges;
    image-rendering: crisp-edges;
    color: white;
}
html,
body {
    margin: 0px;
    width: 100%;
    height: 100%;
}
#app {
    width: 100%;
    height: 100%;
    background-image: url(assets/bg.png);
    background-size: cover;
    background-position-x: center;
    background-position-y: top;
}
button {
    outline: none;
    border: solid black 8px;
    background-color: #663931;
    font-size: 5vmin;
    padding: 10px;
    color: white;
    cursor: pointer;
}
button:hover {
    background: #5c332c;
}
input {
    outline: none;
    border: solid black 8px;
    background-color: #663931;
    font-size: 5vmin;
    padding: 10px;
    color: white;
}
</style>
