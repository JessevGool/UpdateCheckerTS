import DiscordJS, { Intents } from 'discord.js'
import { ApiHandler } from './ApiHandler';
export class UpdateChecker{
    _client: DiscordJS.Client;
    _apiHandler: ApiHandler;
    constructor(client: DiscordJS.Client){
        this._client = client;
        this._apiHandler = new ApiHandler();
    }
}