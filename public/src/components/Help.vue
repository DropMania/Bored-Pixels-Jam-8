<template>
    <div class="help">
        <div class="help-item">
            Create Hero:<br />
            Here you can create your on Hero for 1000<Coin />
        </div>
        <div class="help-item">
            Roll Hero:<br />
            Here you can roll a random Hero for 50<Coin /> (There is a 5% chance
            to get a shiny Hero, who is stronger)
        </div>
        <div class="help-item">
            Questing:<br />
            While this window is open, you gain 10<Coin /> each 10 seconds
        </div>
        <div class="help-item">
            Fighting:<br />
            Here you will be presented with other parties from all over the
            world. You can fight against them to earn a lot of money. However
            you can also lose money
        </div>
        <div class="help-item">
            Manage:<br />
            Here you can arrange your Partie. You see all your rolled and
            created Heros, sorted by atk. You just need to drag them to the +
            button at the top to add them to your partie
        </div>
        <div class="help-item">
            Leaderboard:<br />
            Here you can see the best player in the world, sorted by level or
            coins
        </div>
    </div>
</template>

<script>
import Coin from './Coin.vue'
export default { components: { Coin } }
</script>

<style>
.help {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: left;
    justify-content: space-between;
    height: 100%;
}
.help-item {
    width: 80%;
    font-size: 3vh;
}
</style>
