import Gamedig from 'gamedig'
import logger from 'skinwalker'
import { readFileSync } from 'fs'

interface Options {
    serverIp: string,
    databaseIp: string,
    databaseUsername: string,
    databasePasswd: string,
    queryTimes: number,
    missionEndTimes: string[],
    missionStartTimes: string[],
    logLevel: "TRACE" | "INFO" | "WARN" | "ERROR"
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

logger.init(getOptions().logLevel, {
    traceWriteFile: true,
    traceFileLocation: 'data/logs/',
    infoFileLocation: 'data/logs/',
    warnFileLocation: 'data/logs/',
    errorFileLocation: 'data/logs/',
})

function getOptions(): Options {
    return JSON.parse(readFileSync('data/query-options.json', { encoding: 'utf8', flag: 'r' }));
}

function getServerData(){

    var toReturn = Gamedig.query({
        type: 'arma3',
        host: getOptions().serverIp
    })
1
    return toReturn
}