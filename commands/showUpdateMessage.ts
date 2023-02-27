import { ICommand } from "wokcommands";
import { Mod } from "../objects/Mod";
import { UpdateChecker } from "../objects/UpdateChecker";

export default {
    category: "Testing",
    description: "Shows the message that will be sent once a mod updates",
    slash: 'both',
    testOnly: false,
    ownerOnly: true,

    callback:({client,text})=>
    {
        let checker = new UpdateChecker(client);
        let testMod = new Mod(2455666943,"Test",0,Date.now(),Date.now());
        let embed = checker.createModEmbed(testMod,1099511627776);
        return embed;
    }
} as ICommand