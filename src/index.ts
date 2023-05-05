import Gamedig from 'gamedig'
import logger from 'skinwalker'
import nodeCron from 'node-cron'
import mongoose from 'mongoose'
import ServerState from '../models/serverState.js'
import { readFileSync } from 'fs'

interface Options {
    serverIp: string,
    databaseIp: string,
    databaseUsername: string,
    databasePasswd: string,
    cronTimezone: string
    missionTimes: string[],
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
    date,
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

logger.trace(`Options: ${JSON.stringify(getOptions())}`, `query`)

getOptions().missionTimes.forEach((time: string) => {

    logger.info(`Setting up new cron job on time ${time}`, `query`)

    nodeCron.schedule(time,() => {

        logger.info(`Attempting to log server state to database`, `query`)

        getServerData().then(async (response: ServerResponse) => {

            logger.info(`Got server data`, `query`)
            response.date = new Date().toISOString()
            logger.trace(`serverResponse: ${JSON.stringify(response)}`)

            const serverState = new ServerState(response)
            await serverState.save().then(() => {
                logger.info(`Server state successfully saved to database`, `query`)
            }).catch(err => {
                logger.error(`Failed to save server state to database`, `query`)
                logger.error(err.message, `query`)
            })

        }).catch(err => {
            logger.erro(`Encountered error quering server`, `query`)
            logger.error(err.message, `query`)
        })

    },{
        scheduled: true,
        timezone: getOptions().cronTimezone
    })

})

connectToDatabase()

async function connectToDatabase() {

    const uname = getOptions().databaseUsername
    const passwd = getOptions().databasePasswd
    const ip = getOptions().databaseIp
    const final = `mongodb+srv://${uname}:${passwd}@${ip}`

    logger.info(`Attempting to conncet to database`, `query`)
    await mongoose.connect(final).then(() => {
        logger.info(`Successfuly connected to database`, `query`)
    }).catch(err => {
        logger.error(`Failed to connect to database`, `query`)
        logger.error(err.message, `query`)
    })

}

function getOptions(): Options {
    return JSON.parse(readFileSync('data/query-options.json', { encoding: 'utf8', flag: 'r' }));
}

function getServerData() {

    var toReturn = Gamedig.query({
        type: 'arma3',
        host: getOptions().serverIp
    })

    return toReturn
}