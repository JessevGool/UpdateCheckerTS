import { Client } from "discord.js";
import { UpdateChecker } from "../objects/UpdateChecker";

export default (client: Client)=>{
    const checker = new UpdateChecker(client);
    const sleepTime = 1000*30;
    const checkForUpdates = () =>{
        console.log("Checking for updates...");
        
        checker.checkforModpackUpdates();
        console.log("Done checking for updates.");
        console.log("Sleeping for " + sleepTime/1000/60 + " minutes...");
        setTimeout(checkForUpdates,sleepTime);
    }
    checkForUpdates()
}

export const config = {
    dbName: 'UPDATE_MESSENGER',
    displayName: 'Update Messenger',
}