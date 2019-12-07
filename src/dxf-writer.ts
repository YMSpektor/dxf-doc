export interface DxfWriter {
    writeGroup(code: number, value: number | string): void;
}

export class DxfTextWriter implements DxfWriter {
    text = '';

    private writeLine(s: string | number) {
        this.text += `${s}\n`;
    }

    writeGroup(code: number, value: number | string): void {
        this.writeLine(code.toString().padStart(3, ' '));
        if (typeof value === 'number' && !Number.isInteger(value)) {
            value = value.toFixed(4);
        }
        this.writeLine(value);
    }
}