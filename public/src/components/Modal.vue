<template>
    <div class="parent-window">
        <div
            class="window"
            :style="{
                width: props.width,
                height: props.height
            }"
        >
            <button class="close-btn" @click="setStateNone()">X</button>
            <slot />
        </div>
    </div>
</template>

<script>
import store from '../store'
import callServer from '../callServer'
export default {
    props: {
        width: String,
        height: String
    },
    setup(props) {
        async function setStateNone() {
            let player = await callServer('updatePlayer', {
                id: store.player._id,
                update: { state: 'NONE' }
            })
            store.player = player
        }

        return { props, setStateNone }
    }
}
</script>

<style>
.parent-window {
    width: 100vw;
    height: 100vh;
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
}
.window {
    background-color: #663931;
    border: solid black 8px;
    overflow-y: auto;
    box-shadow: 10px 10px 10px black;
}
.close-btn {
    border-bottom: solid black 8px;
    position: absolute;
    display: block;
    width: 8vh;
    height: 8vh;
    padding: 0;
}
</style>
