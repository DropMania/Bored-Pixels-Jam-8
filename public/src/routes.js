import { createWebHistory, createRouter } from 'vue-router'
import Home from './components/Home.vue'
import Creator from './components/Creator.vue'
import Game from './components/Game.vue'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/create',
        name: 'Create',
        component: Creator
    },
    {
        path: '/game',
        name: 'Game',
        component: Game
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
