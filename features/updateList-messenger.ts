import { Client, MessageEmbed, TextChannel } from "discord.js";
import { DatabaseHandler } from "../objects/DatabaseHandler";


export default (client: Client) => {
    const sleepTime = 1000 * 60 * 15;
    const dbHandler = new DatabaseHandler();
    let debugChannel: string = "701548889118998598"; //Set this to the channel you want a message to be sent in
    let coalitionChannel: string = "468879945293234177";
    let sentBool = false;
    const checkForUpdates = async () => {
        const now = new Date();
        if (now.getUTCDay() == 3 || now.getUTCDay() == 6) {
            if ((now.getUTCHours() == 22 && now.getUTCDay() == 3) || (now.getUTCHours() == 20 && now.getUTCDay() == 6)) {
                if (!sentBool) {
                    console.log("Checking for updates");
                    sentBool = true;
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
                    embed.setFooter({text:`Automated Task`});
                    embed.setTimestamp(Date.now());
                    (client.channels.cache.get(debugChannel) as TextChannel).send({ embeds: [embed] });
                    (client.channels.cache.get(coalitionChannel) as TextChannel).send({ embeds: [embed] });
                    dbHandler.clearModUpdatedList();
                }
            }
            else
            {
                sentBool = false;
            }
        }
        else
        {
            sentBool = false;
        }
        setTimeout(checkForUpdates, sleepTime);
    }
    checkForUpdates()
}

export const config = {
    dbName: 'UPDATELIST_MESSENGER',
    displayName: 'UpdateList Messenger',
}