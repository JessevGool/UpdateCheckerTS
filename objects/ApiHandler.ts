import { Mod } from './Mod';
import secret from "../config/secrets.json";
const fetch = require('node-fetch');
const fs = require('fs');
export class ApiHandler {
    constructor() {
        console.log("ApiHandler created");
    }

    async requestInfo(modList: string[]): Promise<Mod[]> {
        var axios = require('axios');
        var FormData = require('form-data');
        var data = new FormData();
        data.append('itemcount', modList.length);
        modList.forEach(function callback(mod, index) {
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
        axios(config)
            .then(function (response: any) {
                let modList = response.data["response"]["publishedfiledetails"]
                let gatherModInfo: Mod[] = [];
                modList.forEach(function callback(mod: JSON) {
                    let _mod = Object.entries(mod)
                    let id: number = 0;
                    let title: string = "";
                    let fileSize: number = 0;
                    let postDate: number = 0;
                    let updateDate: number = 0;
                    _mod.forEach(element => {

                        if(element[0] == "publishedfileid"){
                            id = element[1];
                        }
                        if(element[0] == "title"){
                            title = element[1];
                        }
                        if(element[0] == "file_size"){
                            fileSize = element[1];
                        }
                        if(element[0] == "time_created"){
                            postDate = element[1];
                        }
                        if(element[0] == "time_updated"){
                            updateDate = element[1];
                        }
                        
                    
                    });
                    gatherModInfo.push(new Mod(id, title, fileSize, postDate, updateDate));
                   
                });
                return gatherModInfo;
                   
            })
            .catch(function (error: any) {
                console.log(error);
            });
        return [];
    }

}