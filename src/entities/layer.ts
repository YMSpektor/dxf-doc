import { DxfWriter } from "..";
import { TableRecord } from "./table";
import { LType } from "./ltype";

export class Layer extends TableRecord {
    public static LAYER_0 = '0';

    constructor(public name: string, handle: string, public ownerHandle: string) {
        super('LAYER', handle, ownerHandle);
    }

    protected writeTableRecord(writer: DxfWriter): void {
        writer.writeGroup(100, 'AcDbLayerTableRecord');
        writer.writeGroup(2, this.name);
        writer.writeGroup(70, 0);
        writer.writeGroup(62, 7);
        writer.writeGroup(6, LType.CONTINUOUS);
        writer.writeGroup(390, 0);
    }
}