import { ICommand } from "wokcommands";

export default {
    category: 'Testing',
    description: 'Replies with pong',
    slash: 'both',                      // Can be 'both', true, false
    testOnly: true,                     // Can be true, false. true makes it only useable in test servers
    callback:() => {
        return 'Pong'                   // return can be used to respond to both slash and legacy commands
    }

} as ICommand