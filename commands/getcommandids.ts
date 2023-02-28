/**
 *     let commands = await client.application?.commands.fetch()
    commands?.forEach(command =>
        console.log(`name: ${command.name} id: ${command.id}`)
        )
 */
import { MessageEmbed, TextChannel } from "discord.js";
import { ICommand } from "wokcommands";
import { UpdateChecker } from "../objects/UpdateChecker";
export default {
    category: 'Info',
    description: 'Gets the list of command ids',
    slash: 'both',                      // Can be 'both', true, false
    ownerOnly: true,
    testOnly: false,                     // Can be true, false. true makes it only useable in test servers
    callback: async ({ client, interaction }) => {
        await interaction.deferReply({ ephemeral: true });
        let commands = await client.application?.commands.fetch()
        let commandNames = ""
        let commandIds = ""
        commands?.forEach(command => {
            commandNames += `${command.name}\n`
            commandIds += `${command.id}\n`
        })
        const embed: MessageEmbed = new MessageEmbed()
        embed.setTitle("Commands");
        embed.setColor('#63031b')
        embed.addField("Commands", commandNames, true);
        embed.addField("IDs", commandIds, true)
        embed.setTimestamp(Date.now())
        interaction.editReply({ embeds: [embed] })

    }

} as ICommand