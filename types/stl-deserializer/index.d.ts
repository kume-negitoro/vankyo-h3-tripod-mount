import type { Geometry } from '@jscad/modeling/src/geometries/types'

declare module '@jscad/stl-deserializer' {
    interface DeserializeOptions {
        filename?: string
        version?: string
        addMetaData?: boolean
        output?: 'script' | 'geometry'
    }

    type DeserializeType = <T extends DeserializeOptions = {
        filename: 'stl'
        addMetaData: true
        output: 'script'
    }>(options: T, stl: Buffer | string) =>
        T['output'] extends infer R
        ? R extends 'script' ? string
        : R extends 'geometry' ? Geometry
        : never : never

    const deserialize: DeserializeType

    export default {
        deserialize
    }
}