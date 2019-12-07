import { TableRecord } from "./table";
import { DxfWriter } from "..";

export class Style extends TableRecord {
    public static STANDARD = 'Standard';

    constructor(public name: string, handle: string, public ownerHandle: string, public font = 'txt') {
        super('STYLE', handle, ownerHandle);
    }

    protected writeTableRecord(writer: DxfWriter): void {
        writer.writeGroup(100, 'AcDbTextStyleTableRecord');
        writer.writeGroup(2, this.name);
        writer.writeGroup(70, 0);
        writer.writeGroup(40, 0);
        writer.writeGroup(41, 1);
        writer.writeGroup(50, 0);
        writer.writeGroup(71, 0);
        writer.writeGroup(42, 1);
        writer.writeGroup(3, this.font);
        writer.writeGroup(4, '');
    }
}