import fs from 'fs'
import { center, translate, align, mirrorX, mirrorZ, scaleX, scaleY } from '@jscad/modeling/src/operations/transforms'
import { cuboid, cylinder, } from '@jscad/modeling/src/primitives'
import { subtract, union } from '@jscad/modeling/src/operations/booleans'
import { hull, hullChain } from '@jscad/modeling/src/operations/hulls'
import type { Geom3 } from '@jscad/modeling/src/geometries/types'
import stlDeserializer from '@jscad/stl-deserializer'


export const main = () => {
    const eps = 0.2
    const sideABLen = 167
    const sideBCLen = 192.5
    const sideCALen = 159

    // https://www.ndl.go.jp/math/s1/c7_3.html
    const x = (Math.pow(sideABLen, 2) + Math.pow(sideBCLen, 2) - Math.pow(sideCALen, 2)) / (2 * sideBCLen)
    const h = Math.sqrt(Math.pow(sideABLen, 2) - Math.pow(x, 2))

    const gx = (0 + x + sideBCLen) / 3
    const gy = (0 + h + 0) / 3

    const vertexRadius = 5
    const vertexHeight = 6
    const vertexHoleRadius = 2 + 0.5
    const vertexHoleHeight = vertexHeight * 2

    const centerNatHoleRadius = 5 / Math.sin(Math.PI / 3)
    const centerNatHoleHeight = 5 * 2 + eps
    const centerVertexRadius = vertexRadius * 2
    const centerVertexHeight = vertexHeight

    const vertex = cylinder({
        radius: vertexRadius,
        height: vertexHeight
    })
    const vertexHole = cylinder({
        radius: vertexHoleRadius,
        height: vertexHoleHeight
    })

    console.log(h)

    const vertexB = translate([0, 0, 0], vertex)
    const vertexA = translate([x, h, 0], vertex)
    const vertexC = translate([sideBCLen, 0, 0], vertex)

    const outerFrame = hullChain(vertexA, vertexB, vertexC, vertexA)

    const vertexBHole = translate([0, 0, 0], vertexHole)
    const vertexAHole = translate([x, h, 0], vertexHole)
    const vertexCHole = translate([sideBCLen, 0, 0], vertexHole)

    const centerVertex = translate([gx, gy, 0], cylinder({
        radius: centerVertexRadius,
        height: centerVertexHeight,
    }))

    const innerFrame = union(
        hull(vertexA, centerVertex),
        hull(vertexB, centerVertex),
        hull(vertexC, centerVertex),
    )

    const centerNatHole = translate([gx, gy, 0], cylinder({
        radius: centerNatHoleRadius,
        height: centerNatHoleHeight,
        segments: 6
    }))

    const vertexCountebore = cylinder({
        radius: vertexHoleRadius + 2,
        height: 2.5 + eps,
    })


    const vertexBCounterbore = translate([0, 0, 0], vertexCountebore)
    const vertexACounterbore = translate([x, h, 0], vertexCountebore)
    const vertexCCounterbore = translate([sideBCLen, 0, 0], vertexCountebore)

    const vs =
        subtract(
            union(
                align({
                    modes: ['none', 'none', 'max']
                }, union(
                    vertexB,
                    vertexA,
                    vertexC,
                    centerVertex,
                )),
                align({
                    modes: ['none', 'none', 'min']
                }, union(
                    // outerFrame,
                    innerFrame,
                ))
            ),
            union(vertexAHole, vertexBHole, vertexCHole),
            align({
                modes: ['none', 'none', 'min'],
                relativeTo: [0, 0, vertexHeight - centerNatHoleHeight]
            }, centerNatHole),
            align({
                modes: ['none', 'none', 'max'],
                relativeTo: [0, 0, 6]
            }, union(
                vertexACounterbore,
                vertexBCounterbore,
                vertexCCounterbore
            ))
        )

    // return vs
    return center({}, mirrorX(mirrorZ(vs)))
}
