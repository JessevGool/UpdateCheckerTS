export class Mod {
    id: number;
    name: string;
    fileSize: number;
    postDate: number;
    updateDate: number;

    constructor(id: number, name: string, fileSize: number, postDate: number, updateDate: number) {
        this.id = id;
        this.name = name;
        this.fileSize = fileSize;
        this.postDate = postDate;
        this.updateDate = updateDate;
    }

    toJson(): string {
        return JSON.stringify(this);
    }
    fileSizeToMB(): string {
        return (this.fileSize / 1000000) + "MB";
    }
    timeStampToDate(): string {
        return new Date(this.updateDate).toLocaleDateString();
    }
}

