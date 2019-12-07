import { DxfWriter } from "..";
import { Entity } from ".";

export class Block extends Entity {
    public entities: Entity[] = [];

    constructor(public name: string, handle: string, ownerHandle: string) {
        super('BLOCK', handle, ownerHandle);
    }

    protected writeEntity(writer: DxfWriter): void {
        writer.writeGroup(100, 'AcDbBlockBegin');
        writer.writeGroup(2, this.name);
        writer.writeGroup(70, 0);
        writer.writeGroup(10, 0);
        writer.writeGroup(20, 0);
        writer.writeGroup(30, 0);
        writer.writeGroup(3, this.name);
        writer.writeGroup(1, '');
        this.entities.forEach(x => x.writeDxf(writer));
    }
}

export class BlockEnd extends Entity {
    constructor(handle: string, ownerHandle: string) {
        super('ENDBLK', handle, ownerHandle);
    }

    protected writeEntity(writer: DxfWriter): void {
        writer.writeGroup(100, 'AcDbBlockEnd');
    }
}