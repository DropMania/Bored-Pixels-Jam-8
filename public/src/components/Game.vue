<template>
    <div class="game">
        <button
            @click="setState('HELP')"
            class="help-btn"
            v-if="store.player.state == 'NONE'"
        >
            ?
        </button>
        <div class="player-section">
            {{ store.player.name }} ({{ store.player.level }})
            <br />
            <div>{{ store.player.money }}<Coin /></div>
        </div>
        <div class="control-section" v-if="store.player.state == 'NONE'">
            <button @click="setState('CREATE')">Create a Hero</button>
            <button @click="setState('ROLL')">Roll new Hero</button>
            <button @click="setState('QUEST')">Go on Quests</button>
            <button @click="setState('FIGHT')">Fight other Parties</button>
            <button @click="setState('MANAGE')">Manage your Partie</button>
            <button @click="setState('BOARD')">Leaderboard</button>
        </div>
        <Modal width="50vw" height="80vh" v-if="store.player.state == 'HELP'">
            <Help />
        </Modal>
        <Modal width="50vw" height="90vh" v-if="store.player.state == 'CREATE'">
            <HeroCreator />
        </Modal>
        <Modal width="60vmin" height="50vh" v-if="store.player.state == 'ROLL'">
            <Roll />
        </Modal>
        <Modal
            width="60vmin"
            height="50vh"
            v-if="store.player.state == 'QUEST'"
        >
            <Quest />
        </Modal>
        <Modal width="90vw" height="90vh" v-if="store.player.state == 'FIGHT'">
            <Fight />
        </Modal>
        <Modal
            width="100vw"
            height="calc(100vh - 16px)"
            v-if="store.player.state == 'MANAGE'"
        >
            <Manage />
        </Modal>
        <Modal width="50vw" height="80vh" v-if="store.player.state == 'BOARD'">
            <Leaderboard />
        </Modal>
    </div>
</template>

<script>
import { useRouter } from 'vue-router'
import store from '../store'
import callServer from '../callServer'
import Modal from './Modal.vue'
import Roll from './Roll.vue'
import Coin from './Coin.vue'
import Quest from './Quest.vue'
import Manage from './Manage.vue'
import Fight from './Fight.vue'
import HeroCreator from './HeroCreator.vue'
import Help from './Help.vue'
import Leaderboard from './Leaderboard.vue'

export default {
    components: {
        Modal,
        Roll,
        Coin,
        Quest,
        Manage,
        Fight,
        HeroCreator,
        Help,
        Leaderboard
    },
    setup() {
        async function setState(state) {
            if (state == 'FIGHT' && store.player.partie.length < 1) {
                alert(
                    'you need to have at least one Hero in your partie.\nyou can arrange your partie under: Manage your Partie'
                )
            } else {
                let player = await callServer('updatePlayer', {
                    id: store.player._id,
                    update: { state }
                })
                store.player = player
            }
        }

        let router = useRouter()
        if (!store.player._id && !localStorage.getItem('player')) {
            router.push({ name: 'Home' })
        }

        return { store, setState }
    }
}
</script>

<style>
.game {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    text-align: center;
    font-size: 5vh;
    width: 100%;
    height: 100%;
}
.help-btn {
    position: fixed;
    top: 5vh;
    left: 5vh;
}
.player-section {
    flex: 1;
    height: 90%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: column;
    align-self: flex-end;
}
.control-section {
    flex: 1;
    display: flex;
    align-items: center;
    flex-direction: column;
}
.control-section > button {
    margin-top: 4vh;
    width: 50%;
}
</style>
