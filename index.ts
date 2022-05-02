import DiscordJS, { Intents } from 'discord.js'
import dotenv from 'dotenv'
dotenv.config()

const client = new DiscordJS.Client({
    intents:[
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES
    ]
})

client.on('ready', () => {
    console.log('Bot is ready')
    //If guildId is empty it will be global
    const guildId = '535921542198984727'
    const guild = client.guilds.cache.get(guildId)
    let commands
    if(guild){
        //Guild based commands
        commands = guild.commands
    }
    else{
        //Global commands
        commands = client.application?.commands
    }
    commands?.create({
        name: 'ping',
        description: 'Pong!',
    })

    commands?.create({
        name: 'add',
        description: 'Add two numbers',
        options: [
            {
                name: 'a',
                description: 'First number',
                required: true,
                type: DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER
            },
            {
                name: 'b',
                description: 'Second number',
                required: true,
                type: DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER
            }
        ]
    })
})

client.on('interactionCreate',async(interaction)=>{
    if(!interaction.isCommand()){
        return
    }
    const {commandName,options} = interaction
    if(commandName === 'ping')
    {
        interaction.reply({
            content: 'Pong!',
            //ephemeral: true,
        })
    }
    else if(commandName === 'add'){
        const a = options.getNumber('a')!
        const b = options.getNumber('b')!

        await interaction.deferReply({
            ephemeral: true,
        })
        await new Promise(resolve => setTimeout(resolve,5000))
        await interaction.editReply({
            content: `Sum of ${a} + ${b} = ${a+b}`,
        })
    }
})
client.login(process.env.TOKEN)