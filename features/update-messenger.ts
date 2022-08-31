import { Client } from "discord.js";
import { UpdateChecker } from "../objects/UpdateChecker";

export default (client: Client)=>{
    const checker = new UpdateChecker(client);
    const sleepTime = 1000*60*15;
    checker.setInitialStatus();
    const checkForUpdates = () =>{
        
        checker.checkforModpackUpdates();
        console.log("Last update: " + new Date().toLocaleString());
        console.log("Sleeping for " + sleepTime/1000/60 + " minutes...");
        setTimeout(checkForUpdates,sleepTime);
    }
    checkForUpdates()
}

export const config = {
    dbName: 'UPDATE_MESSENGER',
    displayName: 'Update Messenger',
}