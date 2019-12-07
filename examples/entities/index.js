const { DxfDocument } = require('../../src');
const { Line, Circle, Ellipse, LwPolyline, Text, Hatch, Arc } = require('../../src/entities');
const { HatchPattern, PolylineBoundaryPath } = require('../../src/entities/hatch');

const fs = require('fs');

HatchPattern.readFileAsync(__dirname + '/acad.pat').then(patterns => {
    const pts = [[150, 10], [160, 60], [190, 70], [190, 10]];

    const dxf = new DxfDocument();

    dxf.extents([0, 0], [400, 100]);
    dxf.limits([0, 0], [400, 100]);

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
    fs.writeFileSync(__dirname + '/example.dxf', dxf.dxf());
});