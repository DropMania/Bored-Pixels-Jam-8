<template>
    <div class="manage">
        <div class="partie-holder">
            <div class="partie-heros">
                <HeroCard
                    v-for="(hero, idx) in partieHeros"
                    :key="idx"
                    :hero="hero"
                    draggable="true"
                    @dragstart="dragstart($event, hero)"
                />
            </div>
            <div
                class="add-btn"
                @drop="drop($event)"
                @dragover="allowDrop($event)"
                v-if="partieHeros.length < 5"
                id="hero-adder"
            >
                +
            </div>
            Drag your Heros here
        </div>
        <div
            class="hero-holder"
            @drop="drop($event)"
            @dragover="allowDrop($event)"
            id="hero-holder"
        >
            <HeroCard
                v-for="(hero, idx) in availableHeros"
                :key="idx"
                :hero="hero"
                draggable="true"
                @dragstart="dragstart($event, hero)"
            />
        </div>
        <div
            class="remove-btn"
            @drop="drop($event)"
            @dragover="allowDrop($event)"
            id="hero-remover"
        >
            x
        </div>
    </div>
</template>

<script>
import store from '../store'
import callServer from '../callServer'
import HeroCard from './HeroCard.vue'
import { ref } from 'vue'
export default {
    components: {
        HeroCard
    },
    computed: {
        partieHeros: function() {
            return store.player.heros.filter((hero) => {
                return store.player.partie.includes(hero._id)
            })
        },
        availableHeros: function() {
            return store.player.heros
                .filter((hero) => {
                    return !store.player.partie.includes(hero._id)
                })
                .sort((a, b) => b.atk - a.atk)
        }
    },
    setup() {
        function dragstart(e, hero) {
            e.dataTransfer.setData('hero', hero._id)
        }
        async function drop(e) {
            e.preventDefault()
            let heroId = e.dataTransfer.getData('hero')
            let player
            if (e.target.id == 'hero-adder') {
                player = await callServer('addHeroToPartie', {
                    id: store.player._id,
                    heroId
                })
                store.player = player
            }
            if (e.target.id == 'hero-holder') {
                player = await callServer('removeHeroFromPartie', {
                    id: store.player._id,
                    heroId
                })
                store.player = player
            }
            if (e.target.id == 'hero-remover') {
                player = await callServer('removeHero', {
                    id: store.player._id,
                    heroId
                })
                store.player = player
            }
        }
        function allowDrop(e) {
            e.preventDefault()
        }
        return {
            store,
            dragstart,
            allowDrop,
            drop
        }
    }
}
</script>

<style>
.manage {
    display: flex;
    width: 100%;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    /* background: url(../assets/manage-bg.png);
    background-size: contain; */
}
.partie-holder {
    display: flex;
    width: 80%;
    justify-content: flex-start;
    align-items: center;
    border: solid black;
    margin: 10px;
    padding: 10px;
    background-color: #555;
}
.add-btn {
    border: solid black 8px;
    width: 10vh;
    height: 10vh;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    font-size: 5em;
    margin-left: 10px;
    margin-right: 10px;
    background-color: black;
}
.remove-btn {
    border: solid black;
    width: 80%;
    height: 10vh;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 10px;
    background-color: black;
}
.hero-holder {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    justify-content: center;
    gap: 10px;
    border: solid black;
    margin: 10px;
    padding: 50px 10px 10px 10px;
    width: 80%;
    min-height: 50vh;
    background-color: #888;
}
.partie-heros {
    display: flex;
    gap: 10px;
}
</style>
