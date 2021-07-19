<template>
    <div class="quest">
        <div>Here you gain<Coin /></div>
        over Time
    </div>
</template>

<script>
import store from '../store'
import callServer from '../callServer'
import Coin from './Coin.vue'
import { onMounted, onBeforeUnmount } from 'vue'
export default {
    components: {
        Coin
    },
    setup() {
        let interval
        onMounted(async () => {
            interval = setInterval(async () => {
                let player = await callServer('updatePlayer', {
                    id: store.player._id,
                    update: { money: store.player.money + 10 }
                })
                store.player = player
            }, 10000)
        })
        onBeforeUnmount(() => {
            clearInterval(interval)
        })
    }
}
</script>

<style>
.quest {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    font-size: 5vh;
    flex-direction: column;
}
</style>
