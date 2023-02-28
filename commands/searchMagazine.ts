import { MessageEmbed, TextChannel } from "discord.js";
import { ICommand } from "wokcommands";
import { FileParser } from "../objects/FileParser";
export default {
    category: 'Utility',
    description: 'Looks for a magazine in the database',
    slash: 'both',                      // Can be 'both', true, false
    testOnly: false,
    minArgs: 1,
    expectedArgs: '<magazinecaliber>',
    /**
     * 
     * [ configFile >> "CfgMagazines" ] call BIS_fnc_exportConfigHierarchy;
     *  
     */
    callback: async ({ client, interaction,text }) => {
        await interaction.deferReply({ ephemeral: false });
        let parser = new FileParser();
        let entries = parser.findMagazine(text);
        let magazineString = "";
        let classNameString = "";
        if (entries.size > 0) {
            entries.forEach((value, key) => {
                magazineString += `${key}\n`;
                classNameString += `${value}\n`;
        })}
        else {
            magazineString = "No magazines found";
            classNameString = "Read the message to the left";
        }
        let neededMessages = Math.ceil(magazineString.length / 1024);
        if(Math.ceil(classNameString.length / 1024) > neededMessages)
        {
            neededMessages = Math.ceil(classNameString.length / 1024);
        }
        if(neededMessages > 1)
        {
            let resultAmount = magazineString.split("\n").length;
            interaction.editReply(`Too many results: ${resultAmount}, please be more specific`);
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