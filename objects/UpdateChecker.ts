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
    coalitionChannel: string = "468879945293234177";


    constructor(client: DiscordJS.Client) {
        this._client = client;
        this._databaseHandler = new DatabaseHandler();
        this._apiHandler = new ApiHandler();
        this._presetList = this.getPresets(this.presetFolderPath)
        this._currentModpack = this.setInitialModPackToCheck();
    }
    async setInitialStatus() {
        let totalSize = await this._databaseHandler.getTotalSize();
        if (totalSize != null) {
            let totalSizeConverted = this.fileSizeToString(totalSize);
            this._client.user?.setPresence({
                status: 'dnd',
                activities: [
                    {
                        name: `Detected ${totalSizeConverted} worth of updates`
                    }
                ]
            })
        }
    }
    async printDEBUG(message: string) {
        console.log(message);

        //(this._client.channels.cache.get(this.coalitionChannel) as TextChannel).send(message);
        await (this._client.channels.cache.get(this.debugChannel) as TextChannel).send(message)

    }


    async printDEBUGEMBED(message: MessageEmbed) {
        (this._client.channels.cache.get(this.coalitionChannel) as TextChannel).send({ embeds: [message] });
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
        let updateSize = 0;
        let _errors = 0;
        databaseMods.forEach(mod => {
            steamAPIMods.forEach(async steamMod => {
                if (mod.id == steamMod.id) {
                    let updated = false
                    if (mod.updateDate != steamMod.updateDate) {
                        mod.updateDate = steamMod.updateDate
                        updated = true
                        if (mod.fileSize != steamMod.fileSize) {
                            console.log(steamMod.fileSize)
                            if (steamMod.fileSize != 0) {
                                updateSize = steamMod.fileSize - mod.fileSize;
                                console.log("---------");
                                console.log("SteamMod: " + steamMod.fileSize + "\nMod: " + mod.fileSize);
                                console.log("---------");
                                mod.fileSize = steamMod.fileSize;
                            }
                            else {
                                this.printDEBUG(`------\n
                                MOD ${mod.name} has been updated\n
                                ID: ${mod.id}\n
                                Time: ${mod.timeStampToDate().toLocaleString()}\n
                                Size was 0\n
                                ------`);
                                _errors += 1;
                                updateSize = 0;
                                updated = false;
                            }
                        }
                        if (mod.name == undefined || mod.id ==undefined || mod.fileSize == undefined || mod.postDate == undefined || mod.updateDate == undefined) {
                            console.log(" error");
                            console.log(mod.name)
                            console.log(mod.id)
                            console.log(mod.fileSize)
                            console.log(mod.postDate)
                            console.log(mod.updateDate)
                            _errors += 1;
                        }
                        if (mod.name != steamMod.name) {
                            mod.name = steamMod.name
                        }

                    }


                    if (updated && _errors == 0) {
                        this._databaseHandler.updateModInCollection(mod)
                        this.printDEBUGEMBED(this.createModEmbed(mod, updateSize))
                        let totalSize = await this._databaseHandler.getTotalSize();
                        if (totalSize != null) {
                            totalSize += updateSize;
                            this._databaseHandler.updateTotalSize(totalSize);
                            let totalSizeConverted = this.fileSizeToString(totalSize);
                            this._client.user?.setPresence({
                                status: 'dnd',
                                activities: [
                                    {
                                        name: `Detected ${totalSizeConverted} worth of updates.`
                                    }
                                ]
                            })
                        }
                        let updatedMods = await this._databaseHandler.getUpdateList();
                        let containsMod = false;
                        updatedMods.forEach(_mod => {
                            if (_mod.id == mod.id) {
                                containsMod = true;
                                _mod.updateDate = mod.updateDate
                                _mod.fileSize = mod.fileSize
                                _mod.name = mod.name
                            }
                        });
                        if (!containsMod) {
                            this._databaseHandler.addModToUpdatedList(mod);
                            this.printDEBUG("Added mod to updated list");
                        }
                        else {
                            this._databaseHandler.updateModInUpdatedList(mod);
                            this.printDEBUG("Updated mod in updated list");
                        }
                    }

                }

            });
        });

    }
    createModEmbed(mod: Mod, updatesize: number) {
        let packString = "";
        this._presetList.forEach(preset => {
            if(preset.getModList().includes(mod.id.toString()))
            {
                if(packString.length > 0)
                {
                    packString += "\n";
                }
                packString += preset.fileName;
            }
        });
        const embed: MessageEmbed = new MessageEmbed()
        embed.setTitle(mod.name + " has been updated");
        embed.setColor('#63031b')
        embed.addField("Updatesize", this.fileSizeToString(updatesize), false);
        embed.addField("Update Time", `<t:${mod.updateDate}:f>`, false)
        embed.addField("Mod ID", mod.id.toString(), false)
        embed.addField("Pack(s)",packString,false)
        embed.setURL(`https://steamcommunity.com/sharedfiles/filedetails/?id=${mod.id}`)
        embed.setTimestamp(Date.now())
        console.log(`------\n
        MOD ${mod.name} has been updated\n
        ID: ${mod.id}\n
        Time: ${mod.timeStampToDate().toLocaleString()}\n
        ------`)
        return embed
    }
    fileSizeToString(updateSize: number): string {
        //UGLY BUT IDC
        if (updateSize > 1) {
            if (updateSize / 1000000000 > 1) {

                return Math.round((updateSize / 1000000000) * 100) / 100 + "GB";
            }
            else
                if (updateSize / 1000000 > 0.1) {
                    return Math.round((updateSize / 1000000) * 100) / 100 + "MB";

                }
                else {
                    return Math.round((updateSize / 1000) * 100) / 100 + "KB"
                }
        }
        else {
            if (updateSize / 1000000000 < -1) {
                return Math.round((updateSize / 1000000000) * 100) / 100 + "GB";
            }
            else
                if (updateSize / 1000000 < -0.1) {
                    return Math.round((updateSize / 1000000) * 100) / 100 + "MB";

                }
                else {
                    return Math.round((updateSize / 1000) * 100) / 100 + "KB"
                }
        }

    }

}