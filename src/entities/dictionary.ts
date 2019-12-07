import { DxfObject } from "../dxf-object";
import { DxfWriter } from "..";

export interface DictionaryEntry {
    [name: string]: string;
}

export class Dictionary implements DxfObject {
    public static ACAD_GROUP = 'ACAD_GROUP';

    entries: DictionaryEntry = {};

    constructor(public handle: string, public ownerHandle?: string) {
    }

    writeDxf(writer: DxfWriter): void {
        writer.writeGroup(0, 'DICTIONARY');
        writer.writeGroup(5, this.handle);
        if (this.ownerHandle) {
            writer.writeGroup(330, this.ownerHandle);
        }
        writer.writeGroup(100, 'AcDbDictionary');
        writer.writeGroup(281, 1);
        Object.keys(this.entries).forEach(key => {
            writer.writeGroup(3, key);
            writer.writeGroup(350, this.entries[key]);
        });
    }
}