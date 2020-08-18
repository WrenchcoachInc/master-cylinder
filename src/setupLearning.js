import { Vec3, Color, BooleanParameter, TreeItem, Group } from '../libs/zea-engine/dist/index.esm.js'
import { createLabelAndLine } from './DOMLabel.js'
import { ExplodePartsOperator } from '../libs/zea-kinematics/dist/index.rawimport.js'
import {
  State,
  StateMachine,
  KeyPressedEvent,
  SwitchState,
  SetParameterValue,
  SetCameraPositionAndTarget,
} from '../libs/zea-statemachine/dist/index.rawimport.js'

// https://material.io/design/color/#tools-for-picking-colors
// Yellow 50

function setupLearning(scene, asset, renderer) {
  const primaryColor = new Color('#FBC02D')

  const addLabelSet = (name, labelDatas) => {
    const labelTree = new TreeItem(name)
    scene.getRoot().addChild(labelTree)

    const balls = []
    const labels = []
    let visibleIndex = -1
    const setLabelVisible = (index) => {
      labels.forEach((label, i) => {
        label.getParameter('Visible').setValue(i == index && index != visibleIndex)
      })
      if (index != visibleIndex) visibleIndex = index
      else visibleIndex = -1
    }
    const visibleParam = new BooleanParameter('Visible', false)
    visibleParam.on('valueChanged', () => {
      const state = visibleParam.getValue()
      balls.forEach((ball) => {
        ball.getParameter('Visible').setValue(state)
      })
      labels.forEach((label, i) => {
        label.getParameter('Visible').setValue(state ? i == visibleIndex : false)
      })
    })

    labelDatas.forEach((labelData) => {
      labelData.color = primaryColor
      const { billboard, ballItem } = createLabelAndLine(labelData)
      const index = labels.length
      labels.push(billboard)
      balls.push(ballItem)
      // labelTree.addChild(billboard, false);

      ballItem.getParameter('Visible').setValue(false)
      billboard.getParameter('Visible').setValue(false)
      labelTree.addChild(ballItem, true)

      ballItem.on('mouseDown', () => {
        setLabelVisible(index)
      })
    })

    return {
      visibleParam,
    }
  }
  const state = 1
  //////////////////////////////////////////////////////////////
  // State 1
  const state1Labels = addLabelSet('state1Labels', [
    { pos: new Vec3(0, -0.19, 0.16), basePos: new Vec3(0, -0.19, 0.05), name: 'Resovoir' },
    { pos: new Vec3(0.008, -0.21, 0.16), basePos: new Vec3(0.008, -0.21, 0.0), name: 'Cylinder' },
    { pos: new Vec3(0, -0.07, 0.16), basePos: new Vec3(0, -0.07, 0.1), name: 'Booster' },
    { pos: new Vec3(0.008, 0.07, 0.16), basePos: new Vec3(0.008, 0.07, 0.0), name: 'Pushrod' },
  ])
  if (state == 1) {
    state1Labels.visibleParam.setValue(true)
  }
  //////////////////////////////////////////////////////////////
  // State 2

  const state2Labels = addLabelSet('state2Labels', [
    { pos: new Vec3(0.008, -0.26, 0.1), basePos: new Vec3(0.008, -0.26, 0.0), name: 'PressureChamber' },
    { pos: new Vec3(0.008, -0.21, 0.1), basePos: new Vec3(0.008, -0.21, 0.0), name: 'SecondaryPiston' },
    { pos: new Vec3(0.008, -0.13, 0.1), basePos: new Vec3(0.008, -0.13, 0.0), name: 'PrimaryPiston' },
    { pos: new Vec3(0.0, -0.237, 0.1), basePos: new Vec3(0.0, -0.237, 0.013), name: 'VentPort', ballRadius: 0.5 },
    {
      pos: new Vec3(0.0, -0.2245, 0.1),
      basePos: new Vec3(0.0, -0.2245, 0.013),
      name: 'ReplenishingPort',
      ballRadius: 0.5,
    },
  ])
  if (state == 2) {
    state2Labels.visibleParam.setValue(true)
  }

  // asset.getParameter('CutPlaneColor').setValue(new Color(0, 0, 0))
  // asset.getParameter('CutPlaneNormal').setValue(new Vec3(1, 0, 0))
  const cutAwayGroup = new Group('cutAwayGroup')
  cutAwayGroup.getParameter('CutPlaneNormal').setValue(new Vec3(1, 0, 0))
  cutAwayGroup.getParameter('CutPlaneDist').setValue(-0.2)
  asset.addChild(cutAwayGroup)

  // asset.on('loaded', () => {
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

  // if (state == 2) {
  //   asset.on('loaded', () => {
  //     cutAwayGroup.getParameter('CutAwayEnabled').setValue(true);
  //     const cutDist = cutAwayGroup.getParameter('CutPlaneDist');
  //     let cutAmount = -0.2;
  //     cutDist.setValue(cutAmount)
  //     const timerCallback = () => {
  //         cutAmount += 0.002;
  //         cutDist.setValue(cutAmount);
  //         if (cutAmount < 0.0) {
  //             timeoutId = setTimeout(timerCallback, 20); // Sample at 50fps.
  //         } else {
  //           state2Labels.setVisible(true)
  //         }
  //     };
  //     setTimeout(timerCallback, 100); // half second delay
  //   });
  // }
  //////////////////////////////////////////////////////////////
  // State 3
  const boosterAndPedalGroup = new Group('boosterAndPedalGroup')
  // boosterAndPedalGroup.getParameter('Highlighted').setValue(true);
  asset.addChild(boosterAndPedalGroup)

  // asset.on('loaded', () => {
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
    ['.', 'SJ Cilindro MESTRE.1', 'Part1.13'],
    ['.', 'SJ Cilindro MESTRE.1', 'tanque_fluido.1'],
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
    part.getOutput().setParam(asset.resolvePath(['SJ Cilindro MESTRE.1', '1.2', 'GlobalXfo']))
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
    part.getOutput().setParam(asset.resolvePath(['SJ Cilindro MESTRE.1', '1.3', 'GlobalXfo']))
    part.getParameter('Axis').setValue(explodeBackSideDir)
    part.getParameter('Stage').setValue(11)
  }
  {
    const part = parts.addElement()
    part.getOutput().setParam(asset.resolvePath(['SJ Cilindro MESTRE.1', 'tampa_tanque', 'GlobalXfo']))
    part.getParameter('Axis').setValue(explodeTopDir)
    part.getParameter('Stage').setValue(9)
  }
  {
    const part = parts.addElement()
    part.getOutput().setParam(asset.resolvePath(['SJ Cilindro MESTRE.1', 'tanque_fluido', 'GlobalXfo']))
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
    part.getOutput().setParam(asset.resolvePath(['SJ Cilindro MESTRE.1', 'Bucha_tanque', 'GlobalXfo']))
    part.getParameter('Axis').setValue(explodeTopDir)
    part.getParameter('Stage').setValue(13)
  }
  explodedPartsOp.getParameter('Stages').setValue(15)

  // if (state == 2) {
  //   boosterAndPedalGroup.getParameter('Visible').setValue(false);
  //   let explodedAmount = 0;
  //   const param = explodedPartsOp.getParameter('Explode');
  //   const timerCallback = () => {
  //       // Check to see if the video has progressed to the next frame.
  //       // If so, then we emit and update, which will cause a redraw.
  //       animatingValue = true;
  //       explodedAmount += 0.02;
  //       // console.log(explodedAmount)
  //       param.setValue(explodedAmount);
  //       // renderer.requestRedraw();
  //       if (explodedAmount < 1.0) {
  //           timeoutId = setTimeout(timerCallback, 20); // Sample at 50fps.
  //       }
  //       animatingValue = false;
  //   };
  //   timeoutId = setTimeout(timerCallback, 100); // half second delay
  // }

  // renderer.getViewport().getCamera().on('globalXfoChanged', ()=>{
  //   const xfo = renderer.getViewport().getCamera().getGlobalXfo()
  //   const target = renderer.getViewport().getCamera().getTargetPostion()
  //   console.log(xfo.toString(), target.toString())
  // })

  const stateMachine = new StateMachine()
  asset.addChild(stateMachine)

  {
    const stage1State = new State('stage1State')

    ///////////////
    // State Events
    const nextStateKeyPressed = new KeyPressedEvent('NextStateKey')
    stage1State.addStateEvent(nextStateKeyPressed)
    nextStateKeyPressed.getParameter('Key').setValue('>')

    const switchToStage2State = new SwitchState()
    nextStateKeyPressed.addChild(switchToStage2State)
    switchToStage2State.getParameter('TargetState').setValue('stage2State')

    ///////////////////////////////
    // State Activation Actions

    const showBoosterAndPedal = new SetParameterValue()
    stage1State.addActivationAction(showBoosterAndPedal)
    showBoosterAndPedal.getParameter('InterpTime').setValue(0.0)
    showBoosterAndPedal.setParam(boosterAndPedalGroup.getParameter('Visible'))
    showBoosterAndPedal.getParameter('Value').setValue(true)

    const setCameraPositionAndTarget = new SetCameraPositionAndTarget()
    stage1State.addActivationAction(setCameraPositionAndTarget)
    setCameraPositionAndTarget.getParameter('Camera').setValue(renderer.getViewport().getCamera())
    setCameraPositionAndTarget.getParameter('InterpTime').setValue(1.0)
    setCameraPositionAndTarget.getParameter('CameraPos').setValue(new Vec3({ x: 0.57098, y: -0.02572, z: 0.10281 }))
    setCameraPositionAndTarget.getParameter('CameraTarget').setValue(new Vec3({ x: 0.00207, y: -0.03195, z: 0.03585 }))

    const EnableLabels = new SetParameterValue()
    // stage1State.addActivationAction(EnableLabels)
    setCameraPositionAndTarget.addChild(EnableLabels)
    EnableLabels.getParameter('InterpTime').setValue(0.0)
    EnableLabels.setParam(state1Labels.visibleParam)
    EnableLabels.getParameter('Value').setValue(true)

    ///////////////////////////////
    // State Deactivation Actions
    const DisableLabels = new SetParameterValue()
    stage1State.addDeactivationAction(DisableLabels)
    DisableLabels.getParameter('InterpTime').setValue(0.0)
    DisableLabels.setParam(state1Labels.visibleParam)
    DisableLabels.getParameter('Value').setValue(false)

    stateMachine.addState(stage1State)
  }

  {
    const stage2State = new State('stage2State')

    ///////////////
    // State Events
    const nextStateKeyPressed = new KeyPressedEvent()
    stage2State.addStateEvent(nextStateKeyPressed)
    nextStateKeyPressed.getParameter('Key').setValue('>')

    const SwitchToStage3State = new SwitchState()
    nextStateKeyPressed.addChild(SwitchToStage3State)
    SwitchToStage3State.getParameter('TargetState').setValue('stage3State')

    const prevStateKeyPressed = new KeyPressedEvent()
    stage2State.addStateEvent(prevStateKeyPressed)
    prevStateKeyPressed.getParameter('Key').setValue('<')
    const switchTostage1State = new SwitchState()
    prevStateKeyPressed.addChild(switchTostage1State)
    switchTostage1State.getParameter('TargetState').setValue('stage1State')

    ///////////////////////////////
    // State Activation Actions
    const hideBoosterAndPedal = new SetParameterValue()
    stage2State.addActivationAction(hideBoosterAndPedal)
    hideBoosterAndPedal.getParameter('InterpTime').setValue(0.0)
    hideBoosterAndPedal.setParam(boosterAndPedalGroup.getParameter('Visible'))
    hideBoosterAndPedal.getParameter('Value').setValue(false)

    const EnableCutaway = new SetParameterValue('EnableCutaway')
    stage2State.addActivationAction(EnableCutaway)
    EnableCutaway.getParameter('InterpTime').setValue(0.0)
    EnableCutaway.setParam(cutAwayGroup.getParameter('CutAwayEnabled'))
    EnableCutaway.getParameter('Value').setValue(true)

    const CutAwayMasterCylinder = new SetParameterValue('CutAwayMasterCylinder')
    stage2State.addActivationAction(CutAwayMasterCylinder)
    CutAwayMasterCylinder.getParameter('InterpTime').setValue(1.0)
    CutAwayMasterCylinder.setParam(cutAwayGroup.getParameter('CutPlaneDist'))
    CutAwayMasterCylinder.getParameter('Value').setValue(0.0)

    const setCameraPositionAndTarget = new SetCameraPositionAndTarget()
    stage2State.addActivationAction(setCameraPositionAndTarget)
    setCameraPositionAndTarget.getParameter('Camera').setValue(renderer.getViewport().getCamera())
    setCameraPositionAndTarget.getParameter('InterpTime').setValue(1.0)
    setCameraPositionAndTarget.getParameter('CameraPos').setValue(new Vec3({ x: 0.31458, y: -0.17705, z: 0.09557 }))
    setCameraPositionAndTarget.getParameter('CameraTarget').setValue(new Vec3({ x: 0.00902, y: -0.16664, z: 0.07171 }))

    const EnableLabels = new SetParameterValue('EnableLabels')
    // stage2State.addActivationAction(EnableLabels)
    setCameraPositionAndTarget.addChild(EnableLabels)
    EnableLabels.getParameter('InterpTime').setValue(0.0)
    EnableLabels.setParam(state2Labels.visibleParam)
    EnableLabels.getParameter('Value').setValue(true)

    ///////////////////////////////
    // State Deactivation Actions
    const DisableLabels = new SetParameterValue('DisableLabels')
    stage2State.addDeactivationAction(DisableLabels)
    DisableLabels.getParameter('InterpTime').setValue(0.0)
    DisableLabels.setParam(state2Labels.visibleParam)
    DisableLabels.getParameter('Value').setValue(false)

    const DisableCutaway = new SetParameterValue('DisableCutaway')
    stage2State.addDeactivationAction(DisableCutaway)
    DisableCutaway.getParameter('InterpTime').setValue(0.0)
    DisableCutaway.setParam(cutAwayGroup.getParameter('CutAwayEnabled'))
    DisableCutaway.getParameter('Value').setValue(false)

    const UnCutAwayMasterCylinder = new SetParameterValue('UnCutAwayMasterCylinder')
    stage2State.addDeactivationAction(UnCutAwayMasterCylinder)
    UnCutAwayMasterCylinder.getParameter('InterpTime').setValue(0.5)
    UnCutAwayMasterCylinder.setParam(cutAwayGroup.getParameter('CutPlaneDist'))
    UnCutAwayMasterCylinder.getParameter('Value').setValue(-0.2)

    stateMachine.addState(stage2State)
  }

  {
    const stage3State = new State('stage3State')

    ///////////////
    // State Events
    const prevStateKeyPressed = new KeyPressedEvent('PrevStateKey')
    stage3State.addStateEvent(prevStateKeyPressed)
    prevStateKeyPressed.getParameter('Key').setValue('<')
    const switchTostage1State = new SwitchState()
    prevStateKeyPressed.addChild(switchTostage1State)
    switchTostage1State.getParameter('TargetState').setValue('stage2State')

    ///////////////////////////////
    // State Activation Actions
    const Explode = new SetParameterValue('Explode')
    stage3State.addActivationAction(Explode)
    Explode.getParameter('InterpTime').setValue(2.0)
    Explode.setParam(explodedPartsOp.getParameter('Explode'))
    Explode.getParameter('Value').setValue(1.0)

    // const EnableLabels = new SetParameterValue('EnableLabels')
    // stage3State.addActivationAction(EnableLabels)
    // EnableLabels.getParameter('InterpTime').setValue(0.0)
    // EnableLabels.setParam(state2Labels.visibleParam)
    // EnableLabels.getParameter('Value').setValue(true)

    const setCameraPositionAndTarget = new SetCameraPositionAndTarget()
    stage3State.addActivationAction(setCameraPositionAndTarget)
    setCameraPositionAndTarget.getParameter('Camera').setValue(renderer.getViewport().getCamera())
    setCameraPositionAndTarget.getParameter('InterpTime').setValue(1.0)
    setCameraPositionAndTarget.getParameter('CameraPos').setValue(new Vec3({ x: 0.40108, y: 0.47376, z: 0.27948 }))
    setCameraPositionAndTarget.getParameter('CameraTarget').setValue(new Vec3({ x: -0.03933, y: 0.07561, z: 0.01556 }))

    ///////////////////////////////
    // State Deactivation Actions

    const unExplode = new SetParameterValue('unExplode')
    stage3State.addDeactivationAction(unExplode)
    unExplode.getParameter('InterpTime').setValue(0.5)
    unExplode.setParam(explodedPartsOp.getParameter('Explode'))
    unExplode.getParameter('Value').setValue(0.0)

    // const DisableLabels = new SetParameterValue('DisableLabels')
    // stage3State.addDeactivationAction(DisableLabels)
    // DisableLabels.getParameter('InterpTime').setValue(0.0)
    // DisableLabels.setParam(state2Labels.visibleParam)
    // DisableLabels.getParameter('Value').setValue(false)

    stateMachine.addState(stage3State)
  }

  stateMachine.setInitialState('stage1State')
  stateMachine.activateState('stage1State', false)
}

export default setupLearning
