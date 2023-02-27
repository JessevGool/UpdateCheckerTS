import { MessageEmbed, TextChannel } from "discord.js";
import { ICommand } from "wokcommands";
import { FileParser } from "../objects/FileParser";
export default {
    category: 'Utility',
    description: 'Looks for a magazine in the database',
    slash: 'both',                      // Can be 'both', true, false
    testOnly: false,
    minArgs: 1,
    ephemeral: true,
    expectedArgs: '<magazinecaliber>',
    permissions: ["MANAGE_MESSAGES"],

    callback: async ({ client, interaction,text }) => {
        await interaction.deferReply({ ephemeral: true });
        let parser = new FileParser();
        let entries = parser.findMagazine(text);
        let magazineString = "";
        let classNameString = "";
        let embeds : MessageEmbed[] = [];
        if (entries.size > 0) {
            entries.forEach((value, key) => {
                magazineString += `${key}\n`;
                classNameString += `${value}\n`;
        })}
        else {
            magazineString = "No magazines found";
        }
        let neededMessages = Math.ceil(magazineString.length / 1024);
        if(Math.ceil(classNameString.length / 1024) > neededMessages)
        {
            neededMessages = Math.ceil(classNameString.length / 1024);
        }
        if(neededMessages > 1)
        {
            return "Too many results, please be more specific";
        }
        else
        {
            const embed: MessageEmbed = new MessageEmbed()
            embed.setTitle("Magazines");
            embed.setColor('#63031b');
            embed.addField("Magazine", magazineString, true);
            embed.addField("Class Name", classNameString, true);
            embed.setTimestamp(Date.now());
            interaction.editReply({ embeds: [embed], });

        }
    }

} as ICommand