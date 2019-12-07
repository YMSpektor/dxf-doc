import { TableRecord } from "./table";
import { DxfWriter } from "..";

export class AppId extends TableRecord {
    constructor(public name: string, handle: string, public ownerHandle: string) {
        super('APPID', handle, ownerHandle);
    }

    protected writeTableRecord(writer: DxfWriter): void {
        writer.writeGroup(100, 'AcDbRegAppTableRecord');
        writer.writeGroup(2, this.name);
        writer.writeGroup(70, 0);
    }
}