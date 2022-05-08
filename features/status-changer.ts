import { Client } from "discord.js";

export default (client: Client) => {
    const statusOptions = [
        "send help",
        "looking at Arma mods",
        "working on a project",
    ]
    let counter = 0;
    const updateStatus = () => {
        client.user?.setPresence({
            status: 'online',
            activities: [
                {
                    name: statusOptions[counter]
                }
            ]
        })
        if (++counter >= statusOptions.length) {
            counter = 0;
        }
        setTimeout(updateStatus, 1000 * 5);
    }
    updateStatus()
}

export const config = {
    dbName: 'STATUS_CHANGER',
    displayName: 'Status Changer',
}