import { MessageEmbed, TextChannel } from "discord.js";
import { ICommand } from "wokcommands";
import { DatabaseHandler } from "../objects/DatabaseHandler";
import { UpdateChecker } from "../objects/UpdateChecker";

export default {
    category: 'Utility',
    description: 'Sends updated mods message',
    slash: 'both',                      // Can be 'both', true, false
    testOnly: false,
    permissions: ["MANAGE_MESSAGES"],
    options: [
        {
            name: 'clear',
            type: 'BOOLEAN',
            description: 'Decides if update list should be cleared',
            required: true,
        }
    ],
    callback: async ({ client, interaction }) => {
        let debugChannel: string = "701548889118998598"; //Set this to the channel you want a message to be sent in
        let coalitionChannel: string = "468879945293234177";
        const dbHandler = new DatabaseHandler();
        let updatedModList = await dbHandler.getUpdateList();
        let updateString = "";
        if (updatedModList.length > 0) {

            updatedModList.forEach(mod => {
                updateString += `${mod.name} - ${mod.id}\n`
            });
        }
        else {
            updateString = "No updates found";
        }
        const embed: MessageEmbed = new MessageEmbed()
        embed.setTitle("Mod Updates since last session");
        embed.setColor('#63031b');
        embed.addField("Updated Mods", updateString, false);
        embed.setFooter({ text: `Manually triggered by: ${interaction.user.tag}` })
        embed.setTimestamp(Date.now());
        const clear = interaction.options.getBoolean('clear');
        if(clear)
        {
            dbHandler.clearModUpdatedList();
        }
        if(interaction.channel?.id == coalitionChannel)
        {
            (client.channels.cache.get(debugChannel) as TextChannel).send({ embeds: [embed] });
        }
        return embed;
    }

} as ICommand