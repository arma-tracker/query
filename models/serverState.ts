import mongoose from "mongoose"

const serverStateSchema = new mongoose.Schema({
    name: String,
    map: String,
    password: Boolean,
    raw: {
        protocol: Number,
        folder: String,
        game: String,
        appId: Number,
        numplayers: Number,
        numbots: Number,
        listentype: String,
        environment: String,
        secure: Number,
        version: String,
        steamid: String,
        tags: []
    },
    date,
    maxplayers: Number,
    players: [],
    bots: [],
    connect: String,
    ping: Number
})

export default mongoose.model('server-log', serverStateSchema)