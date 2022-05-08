import DiscordJS, { Client, Intents, Message, MessageEmbed, TextChannel } from 'discord.js'
import { ApiHandler } from './ApiHandler';
import { DatabaseHandler } from './DatabaseHandler';
import { Mod } from './Mod';
import { Preset } from './Preset';
const fs = require('fs');
export class UpdateChecker {
    presetFolderPath: string = "/config/preset";
    _client: DiscordJS.Client;
    _apiHandler: ApiHandler;
    _databaseHandler: DatabaseHandler;
    _presetList: Preset[] = [];
    _currentModpack: string[] = [];
    debugChannel: string = "701548889118998598"; //Set this to the channel you want a message to be sent in



    constructor(client: DiscordJS.Client) {
        this._client = client;
        this._databaseHandler = new DatabaseHandler();
        this._apiHandler = new ApiHandler();
        this._presetList = this.getPresets(this.presetFolderPath)
        this._currentModpack = this.setInitialModPackToCheck();
    }

    async printDEBUG(message: string) {
        console.log(message);
        
        (this._client.channels.cache.get(this.debugChannel) as TextChannel).send(message);
    }


    async printDEBUGEMBED(message: MessageEmbed) {
        (this._client.channels.cache.get(this.debugChannel) as TextChannel).send({ embeds: [message] });
    }

    getPresets(presetFolderPath: string) {
        let presetHtmls = fs.readdirSync(process.cwd() + presetFolderPath);
        let presets: Preset[] = [];
        presetHtmls.forEach((html: string) => {
            presets.push(new Preset(html))

        });
        return presets
    }
    setInitialModPackToCheck() {
        this._presetList = this.getPresets(this.presetFolderPath)
        let mods: string[] = []
        this._presetList.forEach(preset => {
            mods = mods.concat(preset.modList);
        });
        mods = mods.filter(function (elem, index, self) {
            return index === self.indexOf(elem);
        })
        return mods;
    }
    async checkforModpackUpdates() {
        let newPresets = this.getPresets(this.presetFolderPath)
        newPresets.forEach(newPreset => {
            let isInlist = false;
            this._presetList.forEach(oldPreset => {
                if (newPreset.fileName === oldPreset.fileName) {
                    isInlist = true;
                    if (newPreset.updateTime > oldPreset.updateTime) {
                        this.printDEBUG(newPreset.fileName + " has been updated")
                        this._presetList = this._presetList.filter(obj => { return obj !== oldPreset });
                        this._presetList.push(newPreset);
                        newPreset.modList.forEach(mod => {
                            this._currentModpack.push(mod)
                            this._currentModpack = this._currentModpack.filter(function (elem, index, self) {
                                return index === self.indexOf(elem);
                            })
                        });
                    }
                }
            });
            if (!isInlist) {
                this.printDEBUG(newPreset.fileName + " has been added")
                this._presetList.push(newPreset);
                newPreset.modList.forEach(mod => {
                    this._currentModpack.push(mod)
                    
                    this._currentModpack = this._currentModpack.filter(function (elem, index, self) {
                        return index === self.indexOf(elem);
                    })

                });
            }
        });
        await this.compareDBModsToPresetMods();
    }

    async compareDBModsToPresetMods() {
        let databaseMods = await this._databaseHandler.getModCollectionFromDB();
        let steamAPIMods = await this._apiHandler.requestInfo(this._currentModpack);
        let databaseModIds: number[] = [];
        databaseMods.forEach((DBmod: Mod) => {
            databaseModIds.push(DBmod.id);
        });
        databaseModIds = this.checkIfModIsInDB(databaseModIds, steamAPIMods);
        await this.checkIfModHasUpdated(databaseMods, steamAPIMods)
    }

    checkIfModIsInDB(databaseModIds: number[], steamAPIMods: Mod[]) {
        steamAPIMods.forEach(mod => {
            if (!databaseModIds.includes(mod.id)) {
                this._databaseHandler.addModToCollection(mod);
                databaseModIds.push(mod.id);
            }
        });
        return databaseModIds;
    }

    async checkIfModHasUpdated(databaseMods: Mod[], steamAPIMods: Mod[]) {
        databaseMods.forEach(mod => {
            steamAPIMods.forEach(steamMod => {
                if (mod.id == steamMod.id) {
                    let updated = false
                    if (mod.updateDate != steamMod.updateDate) {
                        mod.updateDate = steamMod.updateDate
                        updated = true
                    }

                    if (mod.fileSize != steamMod.fileSize) {
                        mod.fileSize = steamMod.fileSize
                        updated = true
                    }

                    if (mod.name != steamMod.name) {
                        mod.name = steamMod.name
                        updated = true
                    }

                    if (updated) {
                        this._databaseHandler.updateModInCollection(mod)
                        console.log(mod.id + " has updated")
                        this.printDEBUGEMBED(this.createModEmbed(mod))
                    }

                }

            });
        });

    }
    createModEmbed(mod: Mod) {
        console.log(mod.updateDate)
        const embed: MessageEmbed = new MessageEmbed()
        embed.setTitle(mod.name + " has been updated");
        embed.setColor('#63031b')
        embed.addField("Filesize", mod.fileSizeToMB(), false);
        embed.addField("Update Time", mod.timeStampToDate().toDateString(), false)
        embed.addField("Mod ID", mod.id.toString(), false)
        embed.setURL(`https://steamcommunity.com/sharedfiles/filedetails/?id=${mod.id}`)
        embed.setTimestamp(Date.now())
        console.log(`MOD ${mod.name} has been updated\nID: ${mod.id}`)
        return embed
    }

}