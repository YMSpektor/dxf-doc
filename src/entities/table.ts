import { DxfObject } from "../dxf-object";
import { DxfWriter } from "..";

export class Table implements DxfObject {
    entries: TableRecord[] = [];

    constructor(public name: string, public handle: string) { }

    writeDxf(writer: DxfWriter): void {
        writer.writeGroup(0, 'TABLE');
        writer.writeGroup(2, this.name);
        writer.writeGroup(5, this.handle);
        writer.writeGroup(330, 0);
        writer.writeGroup(100, 'AcDbSymbolTable');
        writer.writeGroup(70, this.entries.length);
        this.writeTableDetails(writer);
        this.entries.forEach(x => x.writeDxf(writer));
        writer.writeGroup(0, 'ENDTAB');
    }

    protected writeTableDetails(writer: DxfWriter): void {
    }
}

export class DimStyleTable extends Table {
    constructor(handle: string) {
        super('DIMSTYLE', handle);
    }

    protected writeTableDetails(writer: DxfWriter): void {
        writer.writeGroup(100, 'AcDbDimStyleTable');
    }
}

export abstract class TableRecord implements DxfObject {
    constructor(public recordName: string, public handle: string, public ownerHandle: string) {
    }

    protected handleGroupCode(): number {
        return 5;
    }

    writeDxf(writer: DxfWriter): void {
        writer.writeGroup(0, this.recordName);
        writer.writeGroup(this.handleGroupCode(), this.handle);
        writer.writeGroup(330, this.ownerHandle);
        writer.writeGroup(100, 'AcDbSymbolTableRecord');
        this.writeTableRecord(writer);
    }

    protected abstract writeTableRecord(writer: DxfWriter): void;
}