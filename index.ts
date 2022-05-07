import DiscordJS, { Intents } from 'discord.js'
import dotenv from 'dotenv'
import WOKCommands from 'wokcommands'
import path from 'path'
import {Preset} from './objects/Preset'
import {ApiHandler} from './objects/ApiHandler'
dotenv.config()

const client = new DiscordJS.Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES
    ]
})

client.on('ready', () => {
    new WOKCommands(client, {
        commandsDir: path.join(__dirname, 'commands'),
        typeScript: true,
        testServers: '535921542198984727',
    })
    console.log('Bot is ready')
})

let preset: Preset = new Preset('Arma_3_Preset_Overthrow_Extra.html');
let apiHandler: ApiHandler = new ApiHandler();
apiHandler.requestInfo(preset.modList);
client.login(process.env.TOKEN)
