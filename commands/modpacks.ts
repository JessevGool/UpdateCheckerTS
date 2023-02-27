import { MessageEmbed } from "discord.js";
import { ICommand } from "wokcommands";
const modpackFolder = "./config/preset/";
const fs = require('fs');

export default {
    category: 'Utility',
    description: 'Returns the current list of modpacks being checked',
    slash: 'both',                      // Can be 'both', true, false
    testOnly: false,                     // Can be true, false. true makes it only useable in test servers
    callback:() => {
        let presetFolderPath: string = "/config/preset";
        let presetHtmls = fs.readdirSync(process.cwd() + presetFolderPath);
        console.log(presetHtmls);
        let presetString = "";
        presetHtmls.forEach((preset: { toString: () => string; }) => {
            presetString = presetString + preset.toString().split(".")[0] + "\n"
        });
        const embed: MessageEmbed = new MessageEmbed()
        embed.setTitle("Current presets");
        embed.setColor('#63031b')
        embed.addField("Presets", presetString, false);
        embed.setTimestamp(Date.now())
        return embed                 // return can be used to respond to both slash and legacy commands
    }

} as ICommand