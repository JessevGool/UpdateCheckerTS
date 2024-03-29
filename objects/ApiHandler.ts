import { Mod } from './Mod';
import secret from "../config/secrets.json";
export class ApiHandler {
    constructor() {
        console.log("ApiHandler created");
    }

    async requestInfo(modList: string[], retries: number = 0): Promise<Mod[]> {

        let _modList: string[] = [];
        modList.push("2558613372");
        _modList = _modList.concat(modList)
        let split = [];
        let gatherModInfo: Mod[] = [];
        let firstSplit = true;
        while (_modList.length > 20) {
            const chunk = _modList.splice(0, 20);
            split.push(chunk);
            if (firstSplit) {
                firstSplit = false;
            }

        };
        split.push(_modList);
        for (let index = 0; index < split.length; index++) {
            const listChunk = split[index];
            var axios = require('axios');
            var FormData = require('form-data');
            var data = new FormData();
            data.append('itemcount', listChunk.length);
            listChunk.forEach(function callback(mod, index) {
                data.append(`publishedfileids[${index}]`, mod);
            });
            var config = {
                method: 'post',
                url: `https://api.steampowered.com/ISteamRemoteStorage/GetPublishedFileDetails/v1/?key=${secret.steamAPIKey}`,
                headers: {
                    ...data.getHeaders()
                },
                data: data
            };
            try {
                const promise = await axios(config).then((response: any) => response.data)
                    .catch(function (error: any) {
                        console.log("Error with Code: "+error.code+" occured");
                    });
                let modlist = promise.response.publishedfiledetails;

                modlist.forEach((mod: any) => {
                    gatherModInfo.push(this.jsonToMod(mod));
                });

                delay(5000);
            } catch (error) {
                if (retries <= 5) {
                    retries++;
                    this.requestInfo(modList, retries);
                }
                else {
                    console.log(error);
                    return [];
                }

            }
        };

        return gatherModInfo;
    }

    jsonToMod(mod: any): Mod {
        let _mod = new Mod(mod.publishedfileid, mod.title, mod.file_size, mod.time_created, mod.time_updated)
        return _mod

    }

}

function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
