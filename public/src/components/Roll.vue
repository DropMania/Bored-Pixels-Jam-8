<template>
    <div class="roll">
        <div class="roll-text" v-if="!rolledHero.name">
            Here you can roll a new Hero
        </div>

        <HeroCard
            :hero="rolledHero"
            :style="{
                width: rolled[0],
                height: rolled[1]
            }"
        />
        <button v-if="!rolledHero.name" @click="roll()">
            Roll {{ rollCost }}<Coin />
        </button>
    </div>
</template>

<script>
import store from '../store'
import callServer from '../callServer'
import { ref } from 'vue'
import HeroCard from './HeroCard.vue'
import Coin from './Coin.vue'
import { sleep } from '../utils'
export default {
    components: {
        HeroCard,
        Coin
    },
    setup() {
        let rollCost = 50
        let rolledHero = ref({})
        let rolled = ref(['0vmin', '0vmin'])
        async function roll() {
            if (store.player.money >= rollCost) {
                let [hero, player] = await callServer('rollHero', {
                    id: store.player._id,
                    cost: store.player.money - rollCost,
                    level: store.player.level
                })
                store.player = player
                rolledHero.value = hero
                rolled.value = ['20vmin', '24vmin']
                await sleep(3000)
                rolledHero.value = {}
                /*  console.log('test')
                player = await callServer('updatePlayer', {
                    id: store.player._id,
                    update: { state: 'NONE' }
                })
                store.player = player */
            }
        }
        return {
            roll,
            rollCost,
            store,
            rolled,
            rolledHero
        }
    }
}
</script>

<style>
.roll {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    background: url(../assets/roll-bg.png);
    background-size: cover;
}
.roll-text {
    color: #f0f0f0;
    text-shadow: 5px 5px 5px black;
    font-size: 5vh;
}
</style>
