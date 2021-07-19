<template>
    <div class="hero-creator" v-if="!createdHero.name">
        <div class="name-input">
            <input placeholder="Name..." type="text" v-model="name" />
        </div>
        <PixelDrawer ref="drawer" />
        <button @click="create()">Create {{ cost }}<Coin /></button>
    </div>
    <div class="created-hero" v-else>
        <HeroCard :hero="createdHero" />
    </div>
</template>

<script>
import store from '../store'
import callServer from '../callServer'
import PixelDrawer from './PixelDrawer.vue'
import Coin from './Coin.vue'
import HeroCard from './HeroCard.vue'
import { ref } from 'vue'
import { sleep } from '../utils'
export default {
    components: {
        PixelDrawer,
        Coin,
        HeroCard
    },
    setup() {
        let drawer = ref(null)
        let name = ref('')
        let cost = 1000
        let createdHero = ref({})
        async function create() {
            if (store.player.money >= cost) {
                if (name.value) {
                    let hero = await callServer('createHero', {
                        id: store.player._id,
                        name: name.value,
                        img: drawer.value.getBase64(),
                        cost: store.player.money - cost,
                        level: store.player.level
                    })
                    createdHero.value = hero
                    await sleep(3000)
                    let player = await callServer('updatePlayer', {
                        id: store.player._id,
                        update: { state: 'NONE' }
                    })
                    store.player = player
                } else {
                    alert('you need to enter a name')
                }
            } else {
                alert('you dont have enough money')
            }
        }
        return { drawer, create, name, cost, createdHero }
    }
}
</script>

<style>
.hero-creator {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    padding-top: 1vh;
}
.name-input {
    width: 80%;
    font-size: 3vh;
}
.name-input input {
    width: 50%;
    font-size: 3vh;
}
.created-hero {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
