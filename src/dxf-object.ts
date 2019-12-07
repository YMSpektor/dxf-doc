import { DxfWriter } from ".";

export interface DxfObject {
    writeDxf(writer: DxfWriter): void;
}