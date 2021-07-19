<template>
    <div class="leaderboard">
        <div class="board-btns">
            <button
                :style="{
                    background: sorter == 'LEVEL' ? '#8a6f30' : '#663931'
                }"
                @click="setSort('LEVEL')"
            >
                Level
            </button>
            <button
                :style="{
                    background: sorter == 'COIN' ? '#8a6f30' : '#663931'
                }"
                @click="setSort('COIN')"
            >
                Coins
            </button>
        </div>
        <div class="board-items">
            <div
                class="board-item"
                v-for="player in allPlayer"
                :key="player._id"
            >
                <div class="board-name">
                    <span v-if="player._id == store.player._id">-</span>
                    {{ player.name }} ({{ player.level }})
                    <span v-if="player._id == store.player._id">-</span>
                </div>
                <div class="board-coins">{{ player.money }}<Coin /></div>
                <div class="board-heros">{{ player.heros.length }} Heros</div>
            </div>
        </div>
    </div>
</template>

<script>
import store from '../store'
import callServer from '../callServer'
import { ref, onMounted } from 'vue'
import Coin from './Coin.vue'
export default {
    components: {
        Coin
    },
    setup() {
        let sorter = ref('LEVEL')
        let allPlayer = ref([])
        function setSort(val) {
            sorter.value = val
            switch (val) {
                case 'LEVEL':
                    allPlayer.value.sort((a, b) => b.level - a.level)
                    break
                case 'COIN':
                    allPlayer.value.sort((a, b) => b.money - a.money)
                    break
            }
        }
        onMounted(async () => {
            allPlayer.value = await callServer('getAllPlayer')
            allPlayer.value.sort((a, b) => b.level - a.level)
        })
        return { sorter, setSort, allPlayer, store }
    }
}
</script>

<style>
.leaderboard {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
}
.board-btns {
    width: 50%;
    display: flex;
    justify-content: space-between;
    margin-top: 1vh;
}
.board-items {
    display: flex;
    flex-direction: column;
    width: 90%;
    margin-top: 3vh;
}
.board-item {
    display: flex;
    text-align: center;
}
.board-item div {
    flex: 1;
}
</style>
