<template>
    <div class="hero-card" v-if="props.hero.name">
        <img
            :src="require(`../assets/heros/${props.hero.img}`)"
            class="hero-img"
            v-if="!props.hero.img.startsWith('data')"
        />
        <img :src="props.hero.img" class="hero-img" v-else />
        <div class="hero-name">
            {{ props.hero.name }}
        </div>
        <div class="hero-atk">ATK: {{ props.hero.atk }}</div>
        <div class="hero-hp">
            {{ props.hero.hp
            }}<!-- /{{ props.hero.maxHp }} -->
            HP
        </div>
        <div class="hero-crit">
            CRIT {{ props.hero.crit }}
            %
        </div>
    </div>
</template>

<script>
export default {
    props: {
        hero: Object
    },
    setup(props) {
        return { props }
    }
}
</script>

<style>
.hero-card {
    aspect-ratio: 10/16;
    width: 20vmin;
    height: 27vmin;
    background-color: #663931;
    border: solid black 8px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    font-size: 3vh;
}
.hero-img {
    border: solid black;
    margin: 10px;
    padding: 5px 5px 0px 5px;
    width: 50%;
}
</style>
