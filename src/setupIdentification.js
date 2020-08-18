import { Vec3, Color, Xfo, BooleanParameter, TreeItem, Group, Material } from '../libs/zea-engine/dist/index.esm.js'
import { ExplodePartsOperator } from '../libs/zea-kinematics/dist/index.rawimport.js'
import { PlanarMovementHandle } from '../libs/zea-ux/dist/index.rawimport.js'
import { createLabelAndLine } from './DOMLabel.js'

// https://material.io/design/color/#tools-for-picking-colors
// Yellow 50

function setupIdentification(scene, asset, renderer, appData) {
  const primaryColor = new Color('#FBC02D')

  const labelLinesMaterial = new Material('LabelLinesMaterial', 'HandleShader')
  // labelLinesMaterial.getParameter('Color').setValue(new Color(0, 0, 0))
  labelLinesMaterial.getParameter('BaseColor').setValue(primaryColor)
  const dir = new Vec3(1, 0, 0)
  const up = new Vec3(0, 0, 1)

  const labelTree = new TreeItem('labelTree')
  scene.getRoot().addChild(labelTree)
  const createLabels = (labelDatas) => {
    labelDatas.forEach((labelData) => {
      console.log('createLabels', labelData.name)
      labelData.color = primaryColor
      const { ballItem } = createLabelAndLine(labelData)

      const handle = new PlanarMovementHandle()
      handle.getParameter('GlobalXfo').setValue(ballItem.getParameter('GlobalXfo').getValue())
      const handleXfo = new Xfo(labelData.basePos)
      handleXfo.ori.setFromDirectionAndUpvector(dir, up)
      handle.getParameter('LocalXfo').setValue(handleXfo)
      // handle.setTargetParam(handle.getParameter("GlobalXfo"), false)

      handle.addChild(ballItem, true)
      labelTree.addChild(handle, true)
    })
  }

  const offset = new Vec3(0, 0, 0.1)
  createLabels([
    { basePos: new Vec3(0, 0.3, 0.2), offset, name: 'ResovoirS', width: 200 },
    { basePos: new Vec3(0.0, 0.2, 0.2), offset, name: 'PrimaryPistonS', width: 200 },
    { basePos: new Vec3(0.0, 0.1, 0.2), offset, name: 'SecondaryPistonS', width: 200 },
    { basePos: new Vec3(0.0, 0, 0.2), offset, name: 'SealS', width: 200 },
    { basePos: new Vec3(0.0, -0.1, 0.2), offset, name: 'PrimaryReturnSpringS', width: 200 },
    { basePos: new Vec3(0.0, -0.2, 0.2), offset, name: 'SecondaryReturnSpringS', width: 200 },
  ])

  //////////////////////////////////////////////////////////////
  // State 3
  const boosterAndPedalGroup = new Group('boosterAndPedalGroup')
  // boosterAndPedalGroup.getParameter('Highlighted').setValue(true);
  asset.addChild(boosterAndPedalGroup)

  // asset.once('loaded', () => {
  boosterAndPedalGroup.resolveItems([
    ['.', 'bacia_1.1'],
    ['.', 'bacia_2.1'],
    ['.', 'disco_dinamico'],
    ['.', 'Part1.8'],
    ['.', 'Symmetry of Part1.8.1'],
    ['.', 'Symmetry of Part1.8.2'],
    ['.', 'Symmetry of Symmetry of Part1.8.1.1'],
    ['.', 'haste_acionamento'],
    ['.', 'Pedal_de freio.1'],
    ['.', 'mola11.1'],
    ['.', 'mola12.1'],
    ['.', 'filtro_ar'],
    ['.', 'bucha_vacuo.1'],
    ['.', 'tubo_vacuo.1'],
    ['.', 'haste_vacuo'],
    ['.', 'bucha_vedada'],
    ['.', 'prato.1'],
    ['.', 'paraf_m6.1'],
    // ['.', 'SJ Cilindro MESTRE.1', 'Part1.13'],
    // ['.', 'SJ Cilindro MESTRE.1', 'tanque_fluido.1'],
  ])
  // })

  const explodedPartsOp = new ExplodePartsOperator('ExplodeParts')
  asset.addChild(explodedPartsOp)
  explodedPartsOp.getParameter('Dist').setValue(0.5)
  explodedPartsOp.getParameter('Cascade').setValue(true)
  const parts = explodedPartsOp.getParameter('Parts')
  const explodeDir = new Vec3(0, 1, 0)
  const explodeFrontSideDir = new Vec3(0.4, 0, 0)
  const explodeBackSideDir = new Vec3(-0.4, 0, 0)
  const explodeTopDir = new Vec3(0, 0, 0.4)

  {
    const part = parts.addElement()
    part.getOutput().setParam(asset.resolvePath(['SJ Cilindro MESTRE.1', 'Anel Trava', 'GlobalXfo']))
    part.getParameter('Axis').setValue(explodeDir)
  }
  {
    const part = parts.addElement()
    part.getOutput().setParam(asset.resolvePath(['SJ Cilindro MESTRE.1', 'Vedante', 'GlobalXfo']))
    part.getParameter('Axis').setValue(explodeDir)
  }
  {
    const part = parts.addElement()
    part.getOutput().setParam(asset.resolvePath(['SJ Cilindro MESTRE.1', 'anel_borracha', 'GlobalXfo']))
    part.getParameter('Axis').setValue(explodeDir)
    part.getParameter('Stage').setValue(part.getParameter('Stage').getValue() - 0.25)
  }
  {
    const part = parts.addElement()
    part.getOutput().setParam(asset.resolvePath(['SJ Cilindro MESTRE.1', 'Cilindro2', 'GlobalXfo']))
    part.getParameter('Axis').setValue(explodeDir)
    part.getParameter('Stage').setValue(part.getParameter('Stage').getValue() + 1.4)
  }
  {
    const part = parts.addElement()
    part.getOutput().setParam(asset.resolvePath(['SJ Cilindro MESTRE.1', 'secundaria.1', 'GlobalXfo']))
    part.getParameter('Axis').setValue(explodeDir)
    part.getParameter('Stage').setValue(part.getParameter('Stage').getValue() - 0.25)
  }
  {
    const part = parts.addElement()
    part.getOutput().setParam(asset.resolvePath(['SJ Cilindro MESTRE.1', 'mola2', 'GlobalXfo']))
    part.getParameter('Axis').setValue(explodeDir)
    part.getParameter('Stage').setValue(part.getParameter('Stage').getValue() - 0.75)
  }
  {
    const part = parts.addElement()
    part.getOutput().setParam(asset.resolvePath(['SJ Cilindro MESTRE.1', 'bucha_guia', 'GlobalXfo']))
    part.getParameter('Axis').setValue(explodeDir)
  }
  {
    const part = parts.addElement()
    part.getOutput().setParam(asset.resolvePath(['SJ Cilindro MESTRE.1', 'secundaria', 'GlobalXfo']))
    part.getParameter('Axis').setValue(explodeDir)
    part.getParameter('Stage').setValue(part.getParameter('Stage').getValue() - 0.75)
  }
  {
    const part = parts.addElement()
    part.getOutput().setParam(asset.resolvePath(['SJ Cilindro MESTRE.1', 'cilind', 'GlobalXfo']))
    part.getParameter('Axis').setValue(explodeDir)
    part.getParameter('Stage').setValue(part.getParameter('Stage').getValue() - 0.25)
  }
  {
    const part = parts.addElement()
    part.getOutput().setParam(asset.resolvePath(['SJ Cilindro MESTRE.1', 'gaxeta', 'GlobalXfo']))
    part.getParameter('Axis').setValue(explodeDir)
    part.getParameter('Stage').setValue(part.getParameter('Stage').getValue() + 0.25)
  }
  {
    const part = parts.addElement()
    part.getOutput().setParam(asset.resolvePath(['SJ Cilindro MESTRE.1', 'mola1', 'GlobalXfo']))
    part.getParameter('Axis').setValue(explodeDir)
  }
  {
    const part = parts.addElement()
    part.getOutput().setParam(asset.resolvePath(['SJ Cilindro MESTRE.1', 'bucha_freio', 'GlobalXfo']))
    part.getParameter('Axis').setValue(explodeFrontSideDir)
    part.getParameter('Stage').setValue(11)
  }
  {
    const part = parts.addElement()
    part.getOutput().setParam(asset.resolvePath(['SJ Cilindro MESTRE.1', '1', 'GlobalXfo']))
    part.getParameter('Axis').setValue(explodeFrontSideDir)
    part.getParameter('Stage').setValue(11)
  }
  {
    const part = parts.addElement()
    part.getOutput().setParam(asset.resolvePath(['SJ Cilindro MESTRE.1', '1.1', 'GlobalXfo']))
    part.getParameter('Axis').setValue(explodeBackSideDir)
    part.getParameter('Stage').setValue(11)
  }
  {
    const part = parts.addElement()
    part.getOutput().setParam(asset.resolvePath(['SJ Cilindro MESTRE.1', '1.2', 'GlobalXfo']))
    part.getParameter('Axis').setValue(explodeFrontSideDir)
    part.getParameter('Stage').setValue(11)
  }
  {
    const part = parts.addElement()
    part.getOutput().setParam(asset.resolvePath(['SJ Cilindro MESTRE.1', '1.3', 'GlobalXfo']))
    part.getParameter('Axis').setValue(explodeBackSideDir)
    part.getParameter('Stage').setValue(11)
  }
  {
    const part = parts.addElement()
    part.getOutput().setParam(asset.resolvePath(['SJ Cilindro MESTRE.1', 'Part1.13', 'GlobalXfo']))
    part.getParameter('Axis').setValue(explodeTopDir)
    part.getParameter('Stage').setValue(9)
  }
  {
    const part = parts.addElement()
    part.getOutput().setParam(asset.resolvePath(['SJ Cilindro MESTRE.1', 'tanque_fluido.1', 'GlobalXfo']))
    part.getParameter('Axis').setValue(explodeTopDir)
    part.getParameter('Stage').setValue(11)
  }
  {
    const part = parts.addElement()
    part.getOutput().setParam(asset.resolvePath(['SJ Cilindro MESTRE.1', 'secundario', 'GlobalXfo']))
    part.getParameter('Axis').setValue(explodeTopDir)
    part.getParameter('Stage').setValue(13)
  }
  {
    const part = parts.addElement()
    part.getOutput().setParam(asset.resolvePath(['SJ Cilindro MESTRE.1', 'primario', 'GlobalXfo']))
    part.getParameter('Axis').setValue(explodeTopDir)
    part.getParameter('Stage').setValue(13)
  }
  explodedPartsOp.getParameter('Stages').setValue(15)

  boosterAndPedalGroup.getParameter('Visible').setValue(false)
  let timeoutId
  let explodedAmount = 0
  let animatingValue
  const param = explodedPartsOp.getParameter('Explode')
  const timerCallback = () => {
    // Check to see if the video has progressed to the next frame.
    // If so, then we emit and update, which will cause a redraw.
    animatingValue = true
    explodedAmount += 0.02
    // console.log(explodedAmount)
    param.setValue(explodedAmount)
    console.log('explodedAmount:', explodedAmount)
    // renderer.requestRedraw();
    if (explodedAmount < 1.0) {
      timeoutId = setTimeout(timerCallback, 20) // Sample at 50fps.
    }
    animatingValue = false
  }
  timeoutId = setTimeout(timerCallback, 100) // half second delay

  // renderer.getViewport().getCamera().on('globalXfoChanged', ()=>{
  //   const xfo = renderer.getViewport().getCamera().getParameter('GlobalXfo').getValue()
  //   const target = renderer.getViewport().getCamera().getTargetPostion()
  //   console.log(xfo.toString(), target.toString())
  // })
  const position = new Vec3({ x: 0.50854, y: 0.13737, z: 0.10604 })
  const target = new Vec3({ x: 0.02116, y: 0.05867, z: 0.15426 })
  renderer.getViewport().getCamera().setPositionAndTarget(position, target)
}

export default setupIdentification
