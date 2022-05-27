
import { Mod } from "./Mod";

export class DatabaseHandler {
    collectionref: any;
    updateref: any;
    constructor() {
        var admin = require("firebase-admin");

        var serviceAccount = require("../config/updateCheckerToken.json");
        if (admin.apps.length === 0) {
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
                databaseURL: "https://updatechecker-12754-default-rtdb.europe-west1.firebasedatabase.app"
            });
        }
        let database = admin.database();
        this.collectionref = database.ref("/ModCollection");
        this.updateref = database.ref("/UpdatedMods");
        console.log("DatabaseHandler initialized");

    }

    async getModCollectionFromDB() {
        let modDict = await this.collectionref.once("value");
        modDict = modDict.val();
        let mods: Mod[] = [];
        for (const key in modDict) {
            mods.push(new Mod(parseInt(key), modDict[key].name, modDict[key].fileSize, modDict[key].postDate, modDict[key].updateDate));
        }
        return mods;
    }

    setModCollectionForDB(mods: Mod[]) {
        mods.forEach((mod: Mod) => {
            this.collectionref.child(mod.id).set(
                {
                    'name': mod.name,
                    'fileSize': mod.fileSize,
                    'postDate': mod.postDate,
                    'updateDate': mod.updateDate
                }
            );
        });
    }

    addModToCollection(mod: Mod) {
        this.collectionref.child(mod.id).set(
            {
                'name': mod.name,
                'fileSize': mod.fileSize,
                'postDate': mod.postDate,
                'updateDate': mod.updateDate
            }
        );
    }
    addModToUpdatedList(mod: Mod) {
        this.updateref.child(mod.id).set(
            {
                'name': mod.name,
                'fileSize': mod.fileSize,
                'postDate': mod.postDate,
                'updateDate': mod.updateDate
            }
        );
    }

    async getUpdateList() {
        let modDict = await this.updateref.once("value");
        modDict = modDict.val();
        let mods: Mod[] = [];
        for (const key in modDict) {
            mods.push(new Mod(parseInt(key), modDict[key].name, modDict[key].fileSize, modDict[key].postDate, modDict[key].updateDate));
        }
        return mods;
    }

    updateModInUpdatedList(mod: Mod) {
        this.updateref.child(mod.id).set(
            {
                'name': mod.name,
                'fileSize': mod.fileSize,
                'postDate': mod.postDate,
                'updateDate': mod.updateDate
            }
        );
    }
    clearModUpdatedList() {
        this.updateref.remove();
    }
    updateModInCollection(mod: Mod) {
        this.collectionref.child(mod.id).update(
            {
                'name': mod.name,
                'fileSize': mod.fileSize,
                'postDate': mod.postDate,
                'updateDate': mod.updateDate
            }
        );
    }

}