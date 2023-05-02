import Gamedig from 'gamedig'
import { readFileSync } from 'fs'

interface Options {
    serverIp: string,
    databaseIp: string,
    databaseUsername: string,
    databasePasswd: string,
    queryTimes: number,
    missionEndTimes: string[],
    missionStartTimes: string[]
}

interface Player {
    name: string,
    raw: string
}

interface ServerResponse {
    name: string,
    map: string,
    password: boolean,
    raw: {
        protocol: number,
        folder: string,
        game: string,
        appId: number,
        numplayers: number,
        numbots: number,
        listentype: string,
        environment: string,
        secure: number,
        version: string,
        steamid: string,
        tags: string[]
    },
    maxplayers: number,
    players: Player[],
    bots: Player[],
    connect: string,
    ping: number
}

function getOptions(): Options {
    return JSON.parse(readFileSync('data/options.json', { encoding: 'utf8', flag: 'r' }));
}

function getServerData(){

    var toReturn = Gamedig.query({
        type: 'arma3',
        host: getOptions().serverIp
    })
1
    return toReturn
}