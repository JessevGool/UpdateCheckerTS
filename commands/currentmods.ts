import { MessageEmbed, TextChannel } from "discord.js";
import { ICommand } from "wokcommands";
import { UpdateChecker } from "../objects/UpdateChecker";
export default {
    category: 'Info',
    description: 'Replies with the list current list of mods being checked',
    slash: 'both',                      // Can be 'both', true, false
    ownerOnly: true,
    testOnly: false,                     // Can be true, false. true makes it only useable in test servers
    callback: ({ client,channel }) => {
        const checker = new UpdateChecker(client);
        let presets = checker.getPresets("/config/preset");
        let mods: string[] = [];
        presets.forEach(preset => {
            let modNames = preset.getModNames();
            modNames.forEach(mod => {
                mods.push(mod);
            });
        });
        if (mods.length > 0) {
            let modString = "";
            let secondaryString = "";
            mods.forEach(mod => {
                if (modString.length <= 900) {
                    modString = modString + mod + "\n";
                }
                else {
                    secondaryString = secondaryString + mod + "\n";
                }

            });
            if (secondaryString == "") {
                const embed: MessageEmbed = new MessageEmbed()
                embed.setTitle("Current mods");
                embed.setColor('#63031b')
                embed.addField("Presets", presets.length.toString(), false);
                embed.addField("Total Mods", mods.length.toString(),false);
                embed.addField("Mods", modString, false)
                embed.setTimestamp(Date.now())
                return embed
            }
            else
            {
                const embed: MessageEmbed = new MessageEmbed()
                embed.setTitle("Current mods 1/2");
                embed.setColor('#63031b')
                embed.addField("Presets", presets.length.toString(), false);
                embed.addField("Total Mods", mods.length.toString(),false);
                embed.addField("Mods", modString, false)
                embed.setTimestamp(Date.now())
                const secondaryEmbed: MessageEmbed = new MessageEmbed();
                secondaryEmbed.setTitle("Current mods 2/2");
                secondaryEmbed.setColor('#63031b')
                secondaryEmbed.addField("Presets", presets.length.toString(), false);
                secondaryEmbed.addField("Total Mods", mods.length.toString(),false);
                secondaryEmbed.addField("Mods", secondaryString, false)
                secondaryEmbed.setTimestamp(Date.now());
                (client.channels.cache.get(channel.id) as TextChannel).send({ embeds: [embed] });
                return secondaryEmbed;
            }

        }
        else {
            return "Modlist is empty"
        }
    }

} as ICommand