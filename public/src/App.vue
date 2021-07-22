<template>
    <div class="loading" v-if="state == 'LOAD'">
        Loading...
    </div>
    <div class="home" v-if="state == 'HOME'">
        <div class="title">They Are The Heros</div>
        <button @click="createPlayer()">Create Player!</button>
    </div>
    <div class="creator" v-if="state == 'CREATE'">
        <input
            @keydown.enter="create"
            placeholder="Name..."
            type="text"
            v-model="name"
        />
        <button @click="create">create</button>
    </div>
    <Game v-if="state == 'GAME'" />
</template>

<script>
import { onMounted, ref } from 'vue'
import callServer from './callServer'
import store from './store'
import { sleep } from './utils'
import Game from './components/Game.vue'
export default {
    components: {
        Game
    },
    setup() {
        let name = ref('')
        let state = ref('HOME')
        onMounted(async () => {
            if (localStorage.getItem('player')) {
                state.value = 'LOAD'
                let player = await callServer('getPlayer', {
                    id: localStorage.getItem('player')
                })
                if (player?._id) {
                    store.player = player
                    state.value = 'GAME'
                } else {
                    state.value = 'HOME'
                }
            }
        })
        function createPlayer() {
            state.value = 'CREATE'
        }
        async function create() {
            state.value = 'LOAD'
            let player = await callServer('create', { name: name.value })
            store.player = player
            localStorage.setItem('player', player._id)
            state.value = 'GAME'
        }
        return {
            state,
            createPlayer,
            create,
            name
        }
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
    color: white;
    image-rendering: pixelated;
    image-rendering: -moz-crisp-edges;
    image-rendering: crisp-edges;
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
.home {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: column;
}
.title {
    font-size: 10vw;
    color: white;
    margin-top: 5vh;
    margin-bottom: 5vh;
    text-shadow: 10px 10px 20px black;
}
.creator {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
}
.loading {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    font-size: 10vh;
}
</style>
