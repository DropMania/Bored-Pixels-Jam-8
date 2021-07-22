<template>
    <div class="fight">
        <div class="fight-title" v-if="state == 'LOAD'">
            Loading...
        </div>
        <div class="fight-title" v-if="state == 'SHOW'">
            Choose an Enemy to Fight!
        </div>
        <div class="enemies" v-if="state == 'SHOW'">
            <div class="fight-title" v-if="enemies.length == 0">
                There is no enemy in your level range
            </div>
            <div class="enemy" v-for="enemy in enemies" :key="enemy._id">
                <img
                    class="enemy-img"
                    :src="require('../assets/otherpartie.png')"
                />
                <div class="enemy-name">
                    {{ enemy.name }} ({{ enemy.level }})
                </div>
                <div class="enemy-heros">
                    {{ enemy.partie.length }} Hero<span
                        v-if="enemy.partie.length != 1"
                        >s</span
                    >
                </div>
                <button @click="fight(enemy)">Fight!</button>
            </div>
        </div>
        <div class="fighting" v-if="state == 'FIGHT'">
            <div>{{ fightEnemy.name }}</div>
            <div class="enemy-fighting">
                <HeroCard
                    v-for="hero in enemyHeros"
                    :hero="hero"
                    :key="hero._id"
                    :id="hero._id"
                />
            </div>
            <button @click="start" v-if="!fighting && !crit">Start!</button>
            <div v-if="fighting && !crit" style="height: 27vh"></div>
            <img
                class="crit-img"
                v-if="crit"
                :src="require('../assets/crit.gif')"
            />
            <div class="me-fighting">
                <HeroCard
                    v-for="hero in myHeros"
                    :hero="hero"
                    :key="hero._id"
                    :id="hero._id"
                />
            </div>
            <div>{{ store.player.name }}</div>
        </div>
        <div class="fight-end" v-if="state == 'END'">
            <div class="win-end" v-if="winningState == 'WON'">
                You have Won!<br />
                you gain {{ winMoney }}<Coin /><br />
                level + 1
            </div>
            <div class="lose-end" v-if="winningState == 'LOST'">
                You have Lost :(<br />
                you lose {{ loseMoney }}<Coin /><br />
            </div>
        </div>
    </div>
</template>

<script>
import store from '../store'
import callServer from '../callServer'
import { onMounted, ref } from 'vue'
import HeroCard from './HeroCard.vue'
import Coin from './Coin.vue'
import { sleep } from '../utils'
export default {
    components: {
        HeroCard,
        Coin
    },
    setup() {
        let enemies = ref([])
        let enemyHeros = ref([])
        let state = ref('LOAD')
        let fighting = ref(false)
        let winningState = ref('')
        let winMoney = ref(0)
        let loseMoney = ref(0)
        let crit = ref(false)
        let critDmg = 1.2
        let loading = ref(true)
        let myHeros = ref(
            store.player.heros.filter((hero) => {
                return store.player.partie.includes(hero._id)
            })
        )
        let fightEnemy = ref({})
        onMounted(async () => {
            let allPlayer = await callServer('getEnemies', {
                id: store.player._id,
                level: store.player.level
            })
            allPlayer.sort(() => Math.random() - 0.5)
            enemies.value = allPlayer.filter((p) => p._id != store.player._id)
            state.value = 'SHOW'
        })
        function fight(enemy) {
            state.value = 'FIGHT'
            enemyHeros.value = enemy.heros.filter((hero) => {
                return enemy.partie.includes(hero._id)
            })
            fightEnemy.value = enemy
        }
        async function start() {
            fighting.value = true
            let mySum = myHeros.value.reduce((acc, hero) => {
                acc += hero.atk + hero.hp
                return acc
            }, 0)
            let enemySum = enemyHeros.value.reduce((acc, hero) => {
                acc += hero.atk + hero.hp
                return acc
            }, 0)
            let multiplier = enemySum / mySum
            winMoney.value = Math.floor(1000 * multiplier)
            loseMoney.value = Math.floor(winMoney.value / 2)
            while (fighting.value) {
                let myEl = document.getElementById(myHeros.value[0]._id)
                myEl.classList.add('animateUp')
                await sleep(250)
                let isMyCrit = myHeros.value[0].crit / 100 > Math.random()
                enemyHeros.value[0].hp -= Math.floor(
                    isMyCrit
                        ? myHeros.value[0].atk * critDmg
                        : myHeros.value[0].atk
                )
                if (isMyCrit) {
                    crit.value = true
                }
                await sleep(250)
                if (isMyCrit) {
                    crit.value = false
                }
                myEl.classList.remove('animateUp')
                if (enemyHeros.value[0].hp <= 0) {
                    enemyHeros.value.shift()
                }
                if (enemyHeros.value.length == 0) {
                    winningState.value = 'WON'
                    break
                }
                let enemyEl = document.getElementById(enemyHeros.value[0]._id)
                enemyEl.classList.add('animateDown')
                await sleep(250)
                let isEnemyCrit = enemyHeros.value[0].crit / 100 > Math.random()
                myHeros.value[0].hp -= Math.floor(
                    isEnemyCrit
                        ? enemyHeros.value[0].atk * critDmg
                        : enemyHeros.value[0].atk
                )
                if (isEnemyCrit) {
                    crit.value = true
                }
                await sleep(250)
                if (isEnemyCrit) {
                    crit.value = false
                }
                enemyEl.classList.remove('animateDown')
                if (myHeros.value[0].hp <= 0) {
                    myHeros.value.shift()
                }
                if (myHeros.value.length == 0) {
                    winningState.value = 'LOST'
                    break
                }
            }
            await sleep(500)
            state.value = 'END'
            await sleep(3000)
            let player = await callServer('updatePlayer', {
                id: store.player._id,
                update: {
                    state: 'NONE',
                    money:
                        winningState.value == 'LOST'
                            ? store.player.money - loseMoney.value < 0
                                ? 0
                                : store.player.money - loseMoney.value
                            : store.player.money + winMoney.value,
                    level:
                        winningState.value == 'LOST'
                            ? store.player.level
                            : store.player.level + 1
                }
            })
            store.player = player
        }
        return {
            enemies,
            fight,
            state,
            enemyHeros,
            myHeros,
            fightEnemy,
            store,
            start,
            fighting,
            winningState,
            winMoney,
            loseMoney,
            crit,
            loading
        }
    }
}
</script>

<style>
@keyframes moveup {
    0% {
        margin-bottom: 0px;
    }
    30% {
        margin-bottom: 0px;
    }
    50% {
        margin-bottom: 40px;
    }
    70% {
        margin-bottom: 0px;
    }
    100% {
        margin-bottom: 0px;
    }
}
@keyframes movedown {
    0% {
        margin-bottom: 0px;
    }
    30% {
        margin-bottom: 0px;
    }
    50% {
        margin-bottom: -40px;
    }
    70% {
        margin-bottom: 0px;
    }
    100% {
        margin-bottom: 0px;
    }
}
.animateUp {
    animation: moveup ease-in-out 0.5s infinite;
}
.animateDown {
    animation: movedown ease-in-out 0.5s infinite;
}
.fight {
    background: url(../assets/fight-bg.png);
    background-size: cover;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
}
.fight-title {
    height: 20%;
    display: flex;
    justify-content: center;
    align-items: center;
}
.enemies {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 80%;
}
.enemy {
    background: #663931;
    border: solid black 8px;
    padding: 2vh;
}
.enemy-img {
    width: 10vh;
}
.fighting {
    display: flex;
    width: 100%;
    height: 100%;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    gap: 2vh;
}
.fighting * {
    height: 27vh;
    transition: ease-in 0.5s;
}
.enemy-fighting {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 2vh;
    width: 55vw;
}
.me-fighting {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 2vh;
    width: 55vw;
}
.crit-img {
    margin-left: -50%;
}
</style>
