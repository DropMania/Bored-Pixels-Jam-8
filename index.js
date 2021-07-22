const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const monk = require('monk')
const db = monk(process.env.DB_CONNECTION)
const heronames = require('./heronames')

app.use(cors())
app.use(express.json())
const players = db.get('player')
app.post('/create', async (req, res) => {
    const { name } = req.body

    const player = {
        name,
        level: 1,
        heros: [],
        partie: [],
        defense_partie: [],
        state: 'NONE',
        money: 100
    }
    let playerResult = await players.insert(player)

    res.json(playerResult)
})
app.post('/getPlayer', async (req, res) => {
    const { id } = req.body
    let data = await players.findOne({ _id: id })
    res.json(data)
})
app.post('/updatePlayer', async (req, res) => {
    const { id, update } = req.body
    await players.update({ _id: id }, { $set: update })
    let data = await players.findOne({ _id: id })
    res.json(data)
})
app.post('/rollHero', async (req, res) => {
    const { id, cost, level } = req.body
    let multiplier = 1
    let shiny = randRange(0, 100) < 5 ? true : false
    multiplier = shiny ? 2 : 1
    multiplier += multiplier * (level / 10)
    let hp = randRange(100, 200)
    let hero = {
        _id: monk.id(),
        name: pickRandom(heronames),
        crit: randRange(5, 15),
        hp: Math.floor(hp * multiplier),
        shiny,
        maxHp: Math.floor(hp * multiplier),
        atk: Math.floor(randRange(10, 20) * multiplier),
        img: randRange(0, 20) + '.png'
    }
    await players.update(
        { _id: id },
        { $push: { heros: hero }, $set: { money: cost } }
    )
    let player = await players.findOne({ _id: id })
    res.json([hero, player])
})
app.post('/createHero', async (req, res) => {
    const { id, name, img, cost, level } = req.body
    let multiplier = 2
    multiplier += multiplier * (level / 10)
    let hp = Math.floor(multiplier * randRange(100, 250))
    let hero = {
        _id: monk.id(),
        name,
        crit: randRange(5, 20),
        hp: hp,
        shiny: true,
        maxHp: hp,
        atk: Math.floor(multiplier * randRange(10, 25)),
        img
    }
    await players.update(
        { _id: id },
        { $push: { heros: hero }, $set: { money: cost } }
    )
    res.json(hero)
})
app.post('/addHeroToPartie', async (req, res) => {
    const { id, heroId } = req.body
    await players.update({ _id: id }, { $push: { partie: heroId } })
    let player = await players.findOne({ _id: id })
    res.json(player)
})
app.post('/removeHeroFromPartie', async (req, res) => {
    const { id, heroId } = req.body
    await players.update({ _id: id }, { $pull: { partie: heroId } })
    let player = await players.findOne({ _id: id })
    res.json(player)
})
app.post('/removeHero', async (req, res) => {
    const { id, heroId } = req.body
    await players.update(
        { _id: id },
        { $pull: { heros: { _id: heroId }, partie: heroId } }
    )
    let player = await players.findOne({ _id: id })
    res.json(player)
})
app.post('/getEnemies', async (req, res) => {
    const { id, level } = req.body
    let data = await players.aggregate([
        {
            $match: {
                level: { $gt: level - 5, $lt: level + 5 },
                $nor: [{ partie: { $size: 0 } }, { _id: id }]
            }
        },
        {
            $sample: { size: 5 }
        }
    ])
    console.log(data)
    res.json(data)
})
app.post('/getAllPlayer', async (req, res) => {
    let data = await players.find({})
    res.json(data)
})
app.get('/player', async (req, res) => {
    let data = await players.find({})
    res.json(data)
})

function pickRandom(a) {
    return a[Math.floor(Math.random() * a.length)]
}
function randRange(a, b) {
    return Math.floor(Math.random() * (b - a + 1) + a)
}

app.listen(5000)
console.log('server started!')
