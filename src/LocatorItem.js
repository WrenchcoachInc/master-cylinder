import { GeomItem, Cross, Material, NumberParameter } from '../libs/zea-engine/dist/index.esm.js'

let cross
class LocatorItem extends GeomItem {
  constructor(name, size = 0.2, color = null) {
    if (!cross) {
      cross = new Cross()
    }
    const material = new Material('LocatorMaterial', 'LinesShader')
    if (color) material.getParameter('BaseColor').setValue(color)
    super(name, cross, material)

    const sizeParam = this.addParameter(new NumberParameter('Size', size))
    const resize = () => {
      const size = sizeParam.getValue()
      const geomOffsetXfoParam = this.getParameter('GeomOffsetXfo')
      const geomOffsetXfo = geomOffsetXfoParam.getValue()
      geomOffsetXfo.sc.set(size, size, size)
      geomOffsetXfoParam.setValue(geomOffsetXfo)
    }
    sizeParam.on('valueChanged', resize)
    resize()
  }
}

export { LocatorItem }
