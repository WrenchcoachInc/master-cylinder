import {
  Ray,
  Vec3,
  Color,
  Xfo,
  Quat,
  EulerAngles,
  BooleanParameter,
  NumberParameter,
  XfoParameter,
  OperatorInput,
  OperatorOutput,
  Operator,
  TreeItem,
  Group,
  Registry,
  RouterOperator,
  OperatorOutputMode,
} from '../libs/zea-engine/dist/index.esm.js'
import { AimOperator } from '../libs/zea-kinematics/dist/index.rawimport.js'
import { ArcSlider } from '../libs/zea-ux/dist/index.rawimport.js'
import { LocatorItem } from './LocatorItem.js'

class RailsOperator extends Operator {
  /**
   * Create a gears operator.
   * @param {string} name - The name value.
   */
  constructor(name) {
    super(name)

    this.addParameter(new NumberParameter('weight', 1))
    this.addParameter(new BooleanParameter('Lock Rotation To Rail', false))
    this.addParameter(new XfoParameter('RailXfo'))
    this.addOutput(new OperatorOutput('InputOutput', OperatorOutputMode.OP_READ_WRITE))
  }

  /**
   * The evaluate method.
   */
  evaluate() {
    const weight = this.getParameter('weight').getValue()
    const railXfo = this.getParameter('RailXfo').getValue()
    const railOri = this.getParameter('Lock Rotation To Rail').getValue()
    const output = this.getOutputByIndex(0)
    const xfo = output.getValue()
    const ray = new Ray(railXfo.tr, railXfo.ori.getXaxis())

    if (weight > 0) {
      let tr = ray.closestPoint(xfo.tr)
      let ori = railXfo.ori
      if (weight < 1.0) {
        tr = xfo.tr.lerp(xfo.tr, weight)
        if (railOri) ori = xfo.ori.lerp(align, weight)
      }
      xfo.tr = tr
      if (railOri) xfo.ori = ori
    }

    output.setClean(xfo)
  }
}

Registry.register('RailsOperator', RailsOperator)

class PistonOperator extends Operator {
  /**
   * Create a gears operator.
   * @param {string} name - The name value.
   */
  constructor(name) {
    super(name)
    this.addParameter(new NumberParameter('weight', 0.5))
    this.addInput(new OperatorInput('PistonXfo'))
    this.addInput(new OperatorInput('EndXfo'))
    this.addOutput(new OperatorOutput('InputOutput'))
  }

  /**
   * The evaluate method.
   */
  evaluate() {
    const weight = this.getParameter('weight').getValue()
    const primaryPistonXfo = this.getInput('PistonXfo').getValue()
    const endXfo = this.getInput('EndXfo').getValue()

    const output = this.getOutputByIndex(0)
    const xfo = output.getValue()
    xfo.tr = primaryPistonXfo.tr.lerp(endXfo.tr, weight)
    output.setClean(xfo)
  }
}

// Registry.register('PistonOperator', PistonOperator)

function setupSimulator(scene, asset, renderer, appData) {
  const locatorSizeScale = 2.0
  const locatorVisible = true

  const cutAway = true
  if (cutAway) {
    const cutAwayGroup = new Group('cutAwayGroup')
    cutAwayGroup.getParameter('CutPlaneNormal').setValue(new Vec3(1, 0, 0))
    cutAwayGroup.getParameter('CutPlaneDist').setValue(-0.2)
    asset.addChild(cutAwayGroup)

    // asset.on('loaded', () => {
    // cutAwayGroup.resolveItems([
    //   ['.', 'SJ Cilindro MESTRE', 'cilindro_mestre'],
    //   ['.', 'SJ Cilindro MESTRE', 'tanque_fluido'],
    //   ['.', 'bacia_1'],
    //   ['.', 'SJ Cilindro MESTRE', 'Bucha_tanque'],
    //   ['.', 'SJ Cilindro MESTRE', 'secundario'],
    //   ['.', 'SJ Cilindro MESTRE', 'bucha_freio'],
    //   ['.', 'SJ Cilindro MESTRE', '1.2'],
    //   ['.', 'bacia_2'],
    //   ['.', 'disco_dinamico'],
    //   ['.', 'Part1'],
    //   ['.', 'Symmetry of Part1.8.2'],
    //   ['.', 'prato'],
    //   ['.', 'paraf_m6'],
    //   ['.', 'SJ Cilindro MESTRE', 'porca_m6.1'],
    //   ['.', 'SJ Cilindro MESTRE', 'anel_borracha'],
    // ])
    cutAwayGroup.resolveItems([
      ['.', 'bacia_1.1'],
      ['.', 'bacia_2.1'],
      ['.', 'SJ Cilindro MESTRE.1', 'cilindro_mestre.1'],
      ['.', 'SJ Cilindro MESTRE.1', 'tanque_fluido.1'],
      ['.', 'SJ Cilindro MESTRE.1', 'Part1.13'],
      // ['.', 'SJ Cilindro MESTRE.1', 'secundario.1'],
      // ['.', 'SJ Cilindro MESTRE.1', 'bucha_freio.1'],
      ['.', 'SJ Cilindro MESTRE.1', '1'],
      ['.', 'SJ Cilindro MESTRE.1', '1.2', '1'],
      ['.', 'disco_dinamico'],
      ['.', 'Part1.8'],
      ['.', 'Symmetry of Part1.8.2'],
      // ['.', 'SJ Cilindro MESTRE.1', 'anel_borracha.1'],
    ])
    // })

    cutAwayGroup.getParameter('CutAwayEnabled').setValue(true)
    cutAwayGroup.getParameter('CutPlaneDist').setValue(0.0)
    // cutAwayGroup.getParameter('CutPlaneDist').setValue(-0.1)

    // let value = -0.2;
    // setInterval(()=> {
    //   value += 0.001;
    //         const smooth_t = Math.smoothStep(0.0, 1.0, value)
    //   cutAwayGroup.getParameter('CutPlaneDist').setValue(value)
    // }, 10)
  }

  const primaryColor = new Color('#FBC02D')

  const target0LocatorItem = new LocatorItem('target0LocatorItem')
  {
    const xfo = new Xfo()
    xfo.tr.set(0.0, 0.0, 0.0)
    target0LocatorItem.getParameter('GlobalXfo').setValue(xfo)
    target0LocatorItem.getParameter('Size').setValue(locatorSizeScale * 0.1)
    target0LocatorItem.getParameter('Visible').setValue(locatorVisible)

    scene.getRoot().addChild(target0LocatorItem)
  }
  const arcSlider = new ArcSlider('BrakePedalSlider')
  const xfo = new Xfo()
  xfo.tr.set(0.0, 0.123, 0.038)
  xfo.ori.setFromEulerAngles(new EulerAngles(0, Math.PI * -0.5, Math.PI * 0.5))
  const q = new Quat()
  q.setFromAxisAndAngle(new Vec3(0, 0, 1), 0.8)
  xfo.ori = xfo.ori.multiply(q)
  arcSlider.getParameter('GlobalXfo').setValue(xfo)

  arcSlider.getParameter('Color').setValue(primaryColor)
  arcSlider.getParameter('Handle Radius').setValue(0.013)
  arcSlider.getParameter('Arc Radius').setValue(0.23)
  arcSlider.getParameter('Arc Angle').setValue(0.7)

  let releaseBrakeId
  const releaseBrake = () => {
    const localXfoParam = arcSlider.handle.getParameter('LocalXfo')
    let value = localXfoParam.getValue()
    const timerCallback = () => {
      value.ori = value.ori.lerp(new Quat(), 0.2)
      localXfoParam.setValue(value)
      if (value.ori.getAngle() > 0.01) {
        releaseBrakeId = setTimeout(timerCallback, 20) // Sample at 50fps.
      } else {
        releaseBrakeId = null
      }
    }
    releaseBrakeId = setTimeout(timerCallback, 0) // half second delay
  }

  arcSlider.on('dragEnd', releaseBrake)
  arcSlider.on('dragStart', () => {
    clearTimeout(releaseBrakeId)
  })

  scene.getRoot().addChild(arcSlider)

  {
    const locatorItem = new LocatorItem('BrakePedalLocator')
    locatorItem.getParameter('GlobalXfo').setValue(xfo)
    locatorItem.getParameter('Size').setValue(locatorSizeScale * 0.1)
    locatorItem.getParameter('Visible').setValue(locatorVisible)
    arcSlider.handle.addChild(locatorItem)

    const pedalGroup = new Group('pedalGroup')
    pedalGroup.addItem(asset.resolvePath(['.', 'Pedal_de freio.1']))
    locatorItem.addChild(pedalGroup)
  }
  // return;

  const pushRodLocatorItem = new LocatorItem('pushRodLocatorItem')
  {
    const xfo = new Xfo()
    xfo.tr.set(0.0, 0.137, 0.0)
    pushRodLocatorItem.getParameter('GlobalXfo').setValue(xfo)
    pushRodLocatorItem.getParameter('Size').setValue(locatorSizeScale * 0.05)
    pushRodLocatorItem.getParameter('Visible').setValue(locatorVisible)
    arcSlider.handle.addChild(pushRodLocatorItem)

    const aimOp = new AimOperator()
    aimOp.getParameter('Axis').setValue(3)
    aimOp.getInput('Target').setParam(target0LocatorItem.getParameter('GlobalXfo'))
    aimOp.getOutputByIndex(0).setParam(pushRodLocatorItem.getParameter('GlobalXfo'))
    pushRodLocatorItem.addChild(aimOp)

    const pushRodGroup = new Group('pushRodGroup')
    pushRodLocatorItem.addChild(pushRodGroup)
    pushRodGroup.addItem(asset.resolvePath(['.', 'haste_acionamento']))
  }

  const railLocatorItem = new LocatorItem('railLocatorItem', 0.3, new Color(1, 0, 0))
  {
    const xfo = new Xfo()
    xfo.tr.set(0.0, -0.03, 0.0)
    xfo.ori.setFromAxisAndAngle(new Vec3(0, 0, 1), -Math.PI * 0.5)
    railLocatorItem.getParameter('GlobalXfo').setValue(xfo)
    railLocatorItem.getParameter('Size').setValue(locatorSizeScale * 0.05)
    railLocatorItem.getParameter('Visible').setValue(locatorVisible)
    pushRodLocatorItem.addChild(railLocatorItem)

    const railsOp = new RailsOperator()
    railsOp.getParameter('RailXfo').setValue(xfo)
    railsOp.getParameter('Lock Rotation To Rail').setValue(true)
    railsOp.getOutputByIndex(0).setParam(railLocatorItem.getParameter('GlobalXfo'))
    railLocatorItem.addChild(railsOp, false)

    const railGroup = new Group('railGroup')
    railGroup.addItem(asset.resolvePath(['.', 'haste_vacuo']))
    railGroup.addItem(asset.resolvePath(['.', 'SJ Cilindro MESTRE', 'Cilindro2']))
    railGroup.addItem(asset.resolvePath(['.', 'SJ Cilindro MESTRE', 'secundaria.1']))
    railGroup.addItem(asset.resolvePath(['.', 'bucha_vedada']))
    railGroup.addItem(asset.resolvePath(['.', 'disco_dinamico']))
    railGroup.addItem(asset.resolvePath(['.', 'mola11']))
    railGroup.addItem(asset.resolvePath(['.', 'filtro_ar']))
    railLocatorItem.addChild(railGroup)
  }

  {
    const locatorItem0 = new LocatorItem('locatorItem0')
    const xfo0 = railLocatorItem.getParameter('GlobalXfo').getValue().clone()
    xfo0.tr.set(0.0, -0.14, 0.0)
    locatorItem0.getParameter('GlobalXfo').setValue(xfo0)
    locatorItem0.getParameter('Size').setValue(locatorSizeScale * 0.05)
    locatorItem0.getParameter('Visible').setValue(locatorVisible)
    railLocatorItem.addChild(locatorItem0)

    const secondaryPistonLocator = new LocatorItem('secondaryPistonLocator')
    const xfo2_5 = railLocatorItem.getParameter('GlobalXfo').getValue().clone()
    xfo2_5.tr.set(0.0, -0.212, 0.0)
    secondaryPistonLocator.getParameter('GlobalXfo').setValue(xfo2_5)
    secondaryPistonLocator.getParameter('Size').setValue(locatorSizeScale * 0.05)
    secondaryPistonLocator.getParameter('Visible').setValue(locatorVisible)
    asset.addChild(secondaryPistonLocator)

    const locatorItem3 = new LocatorItem('locatorItem3')
    const xfo3 = railLocatorItem.getParameter('GlobalXfo').getValue().clone()
    xfo3.tr.set(0.0, -0.288, 0.0)
    locatorItem3.getParameter('GlobalXfo').setValue(xfo3)
    locatorItem3.getParameter('Size').setValue(locatorSizeScale * 0.02)
    locatorItem3.getParameter('Visible').setValue(locatorVisible)
    asset.addChild(locatorItem3)

    const secondaryPistonOperator = new PistonOperator('secondaryPistonOperator')
    secondaryPistonOperator.getInput('PistonXfo').setParam(locatorItem0.getParameter('GlobalXfo'))
    secondaryPistonOperator.getInput('EndXfo').setParam(locatorItem3.getParameter('GlobalXfo'))
    secondaryPistonOperator.getOutputByIndex(0).setParam(secondaryPistonLocator.getParameter('GlobalXfo'))
    asset.addChild(secondaryPistonOperator)

    const secondaryPistonGroup = new Group('secondaryPistonGroup')
    secondaryPistonGroup.addItem(asset.resolvePath(['.', 'SJ Cilindro MESTRE', 'cilind']))
    secondaryPistonGroup.addItem(asset.resolvePath(['.', 'SJ Cilindro MESTRE', 'gaxeta']))
    secondaryPistonGroup.addItem(asset.resolvePath(['.', 'SJ Cilindro MESTRE', 'secundaria']))
    secondaryPistonGroup.addItem(asset.resolvePath(['.', 'SJ Cilindro MESTRE', 'bucha_guia']))
    secondaryPistonLocator.addChild(secondaryPistonGroup)

    const locatorItem1 = new LocatorItem('locatorItem1')
    const xfo1 = railLocatorItem.getParameter('GlobalXfo').getValue().clone()
    xfo1.tr.set(0.0, -0.188, 0.0)
    locatorItem1.getParameter('GlobalXfo').setValue(xfo1)
    locatorItem1.getParameter('Size').setValue(locatorSizeScale * 0.08)
    locatorItem1.getParameter('Visible').setValue(locatorVisible)
    secondaryPistonLocator.addChild(locatorItem1)

    const spring = asset.resolvePath(['.', 'SJ Cilindro MESTRE.1', 'mola1.1'])
    const locatorItem2 = new LocatorItem('locatorItem2')
    const xfo2 = new Xfo()
    xfo2.ori = spring.getParameter('GlobalXfo').getValue().ori
    xfo2.tr.set(0.0, -0.232, 0.0)
    locatorItem2.getParameter('GlobalXfo').setValue(xfo2)
    locatorItem2.getParameter('Size').setValue(locatorSizeScale * 0.08)
    locatorItem2.getParameter('Visible').setValue(locatorVisible)
    secondaryPistonLocator.addChild(locatorItem2)

    {
      const aimOp = new AimOperator()
      aimOp.getParameter('Stretch').setValue(1.0)
      aimOp.getParameter('Axis').setValue(3)
      aimOp.getInput('Target').setParam(locatorItem3.getParameter('GlobalXfo'))
      aimOp.getOutputByIndex(0).setParam(locatorItem2.getParameter('GlobalXfo'))
      locatorItem2.addChild(aimOp)
      aimOp.resetStretchRefDist()
    }

    const endSpringGroup = new Group('endSpringGroup')
    endSpringGroup.addItem(spring)
    locatorItem2.addChild(endSpringGroup)

    //////////////////////////////////////
    // Primary piston spring

    {
      const aimOp = new AimOperator()
      aimOp.getParameter('Stretch').setValue(0.5)
      aimOp.getParameter('Axis').setValue(2)
      aimOp.getInput('Target').setParam(locatorItem0.getParameter('GlobalXfo'))
      aimOp.getOutputByIndex(0).setParam(locatorItem1.getParameter('GlobalXfo'))
      locatorItem1.addChild(aimOp)
      aimOp.resetStretchRefDist()
    }

    const primaryPistonSpringGroup = new Group('primaryPistonSpringGroup')
    primaryPistonSpringGroup.addItem(asset.resolvePath(['.', 'SJ Cilindro MESTRE', 'mola2']))
    locatorItem1.addChild(primaryPistonSpringGroup)
  }

  //////////////////////////////////////
  // Booster spring

  {
    const boosterSpringLocator0 = new LocatorItem('boosterSpringLocator0')
    const xfo0 = railLocatorItem.getParameter('GlobalXfo').getValue().clone()
    xfo0.tr.set(0, -0.112, 0.2)
    boosterSpringLocator0.getParameter('GlobalXfo').setValue(xfo0)
    boosterSpringLocator0.getParameter('Size').setValue(locatorSizeScale * 0.01)
    boosterSpringLocator0.getParameter('Visible').setValue(locatorVisible)
    asset.addChild(boosterSpringLocator0)

    const boosterSpringLocator1 = new LocatorItem('boosterSpringLocator1')
    const xfo1 = railLocatorItem.getParameter('GlobalXfo').getValue().clone()
    xfo1.tr.set(0, -0.045, 0.2)
    boosterSpringLocator1.getParameter('GlobalXfo').setValue(xfo1)
    boosterSpringLocator1.getParameter('Size').setValue(locatorSizeScale * 0.05)
    boosterSpringLocator1.getParameter('Visible').setValue(locatorVisible)
    railLocatorItem.addChild(boosterSpringLocator1)

    const aimOp = new AimOperator()
    aimOp.getParameter('Stretch').setValue(1)
    aimOp.getParameter('Axis').setValue(5)
    aimOp.getInput('Target').setParam(boosterSpringLocator0.getParameter('GlobalXfo'))
    aimOp.getOutputByIndex(0).setParam(boosterSpringLocator1.getParameter('GlobalXfo'))
    aimOp.resetStretchRefDist()
    boosterSpringLocator1.addChild(aimOp)

    const boosterSpringGroup = new Group('boosterSpringGroup')
    // boosterSpringGroup.getParameter("InitialXfoMode").setValue(0)
    boosterSpringLocator1.addChild(boosterSpringGroup, false)
    boosterSpringGroup.addItem(asset.resolvePath(['.', 'mola12']))
  }
}

export default setupSimulator
