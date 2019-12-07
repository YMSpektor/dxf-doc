# dxf-doc
JavaScript library for writing DXF files. The library provides a low-level interface, so basic understanding of the DXF format is not required but can be helpful. The verion of generated DXF files is AC1021 (AutoCAD R2007), so Unicode (UTF-8) is supported

## DxfDocument
The class provides the following oprations
* addHeaderVariables
* addLayer
* addLineType
* addStyle
* addBlock
* addEntity/addEntities
* extents - the shorthand to define drawing extents in the header
* limits - the shorthand to define drawing limits in the header
* dxf - returns dxf file content as a string

## Supported entity types
* LINE
* CIRCLE
* ELLIPSE
* ARC
* LWPOLYLINE
* TEXT
* HATCH

## Example
```JavaScript
const { DxfDocument } = require('dxf-doc');
const { Line, Circle, LwPolyline, Text, Hatch, Ellipse, Arc } = require('dxf-doc/entities');
const { HatchPattern, PolylineBoundaryPath } = require('dxf-doc/entities/hatch');

const fs = require('fs');

// Load patterns from the acad.pat file
HatchPattern.readFileAsync(__dirname + '/acad.pat').then(patterns => {
    const pts = [[150, 10], [160, 60], [190, 70], [190, 10]];

    const dxf = new DxfDocument();

    dxf.extents([0, 0], [250, 100]);
    dxf.limits([0, 0], [250, 100]);

    // Add entities
    dxf.addEntities(
        new Line(dxf, 10, 10, 70, 70),
        new Circle(dxf, 110, 40, 30),
        new LwPolyline(dxf, pts, true),
        new Hatch(dxf, [
            new PolylineBoundaryPath(pts)
        ], patterns[0]),
        new Text(dxf, 'Hello World!', 5, [200, 50]),
        new Ellipse(dxf, 280, 40, 30, 10, 0.5),
        new Arc(dxf, 360, 40, 30, 0, 270)
    );

    // Save to file
    fs.writeFileSync(__dirname + '/example.dxf', dxf.dxf());
});
```

## Authors
* Yuri Spektor

## License
MIT - http://rem.mit-license.org
