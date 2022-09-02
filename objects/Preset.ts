
import fs from 'fs';
import BeautifulDom from 'beautiful-dom';
let defaultPath = "config/preset/";
export class Preset {
    fileName: string;
    updateTime: number;
    modList: string[];
    constructor(fileName: string) {
        this.fileName = fileName;
        this.updateTime = this.getUpdateTime();
        this.modList = this.getModList();
    }
    getUpdateTime(): number {
        return fs.statSync(defaultPath + this.fileName).mtimeMs;
    }
    getModList(): string[] {
        let modList: string[] = [];
        let preset = fs.readFileSync(defaultPath + this.fileName).toString();
        const dom = new BeautifulDom(preset);
        let modNodes = dom.querySelectorAll('a');
        let modLinks: string[] = [];
        modNodes.forEach(node => {
            let link = node.getAttribute('href');
            if (link != null) {
                modLinks.push(link);
            }

        });
        modLinks.forEach(link => {
            let splitLink = link.split('?id=');
            if (splitLink.length == 2) {
                modList.push(splitLink[1]);
            }
        });
        return modList;
    }
    getModNames(): string[] {
        let modList: string[] = [];
        let preset = fs.readFileSync(defaultPath + this.fileName).toString();
        const dom = new BeautifulDom(preset);
        let modNodes = dom.querySelectorAll('td');
        modNodes.forEach(node => {
            if(node.getAttribute('data-type') == 'DisplayName')
            {
                modList.push(node.innerText);
            }
        });
        return modList;
    }
    
}