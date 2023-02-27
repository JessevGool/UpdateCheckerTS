import { readFileSync } from "fs";
export class FileParser {
    contents: String;
    magazineMap: Map<String, String>;
    constructor() {
        this.contents = this.readFile();
        this.magazineMap = this.parseFile();
    }
    private readFile() {
        const file = readFileSync("./config/cfgfiles/CfgMagazines.txt", "utf8");
        return file;
    }

    private parseFile() {
        let magazineMap = new Map<String, String>();
        let lines = this.contents.split("<span");
        lines.forEach(line => {
            let requiredInfo = line.split("span>")[0];
            let splitInfo = requiredInfo.split("style");
            let titleLine = splitInfo[0];
            let title = titleLine.substring(
                titleLine.indexOf('""') + 2,
                titleLine.lastIndexOf('""')
            )
            if (title == "") {
                return;
            }
            let classNameLine = splitInfo[1];
            let className = classNameLine.substring(
                classNameLine.indexOf('>') + 1,
                classNameLine.lastIndexOf('<')
            )
            magazineMap.set(title, className);
        });
        return magazineMap
    }

    findMagazine(magazineName: String) {
        let correctEntries = new Map<String, String>();
        this.magazineMap.forEach((value, key) => {
            if (key.toLowerCase().includes(magazineName.toLowerCase())) {
                correctEntries.set(key, value);
            }
        })
        return correctEntries;
    }
}