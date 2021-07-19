<template>
    <div class="home">
        <div class="title">They Are The Heros</div>
        <button @click="createPlayer()">Create Player!</button>
    </div>
</template>

<script>
import { useRouter } from 'vue-router'
export default {
    setup() {
        let router = useRouter()
        function createPlayer() {
            router.push({ name: 'Create' })
        }
        return {
            createPlayer
        }
    }
}
</script>

<style>
.home {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: column;
}
.title {
    font-size: 10vw;
    color: white;
    margin-top: 5vh;
    margin-bottom: 5vh;
    text-shadow: 10px 10px 20px black;
}
</style>
