<template>
    <div class="creator">
        <input
            @keydown.enter="create"
            placeholder="Name..."
            type="text"
            v-model="name"
        />
        <button @click="create">create</button>
    </div>
</template>

<script>
import { ref } from 'vue'
import store from '../store'
import callServer from '../callServer'
import { useRouter } from 'vue-router'
export default {
    setup() {
        let name = ref('')
        let router = useRouter()
        async function create() {
            let player = await callServer('create', { name: name.value })
            store.player = player
            localStorage.setItem('player', player._id)
            router.push({ name: 'Game' })
        }

        return {
            name,
            create,
            store
        }
    }
}
</script>

<style>
.creator {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
}
</style>
