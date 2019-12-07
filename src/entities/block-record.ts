import { TableRecord } from "./table";
import { DxfWriter } from "..";

export class BlockRecord extends TableRecord {
    public static MODEL_SPACE = '*Model_Space';
    public static PAPER_SPACE = '*Paper_Space';

    constructor(public name: string, handle: string, public ownerHandle: string) {
        super('BLOCK_RECORD', handle, ownerHandle);
    }

    protected writeTableRecord(writer: DxfWriter): void {
        writer.writeGroup(100, 'AcDbBlockTableRecord');
        writer.writeGroup(2, this.name);
        writer.writeGroup(340, 0);
    }
}