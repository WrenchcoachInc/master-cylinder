
// https://material.io/design/color/#tools-for-picking-colors
// Yellow 50


function setupStates(scene, asset, renderer, appData) {

  
  const primaryColor = new ZeaEngine.Color('#FBC02D');


  const addLabelSet = (name, labelDatas) => {
    const labelTree = new ZeaEngine.TreeItem(name);
    scene.getRoot().addChild(labelTree);

    const balls = [];
    const labels = [];
    let visibleIndex = -1;
    const setLabelVisible = index => {
      labels.forEach((label, i) => {
        label.getParameter('Visible').setValue(i==index && index != visibleIndex )
      });
      if (index != visibleIndex)
        visibleIndex = index;
      else 
        visibleIndex = -1;
    }
    const visibleParam = new ZeaEngine.BooleanParameter('Visible', false)
    visibleParam.valueChanged.connect(()=>{
      const state = visibleParam.getValue();
      balls.forEach(ball => {
        ball.getParameter('Visible').setValue(state)
      });
      labels.forEach((label, i) => {
        label.getParameter('Visible').setValue(state ? i==visibleIndex : false )
      });
    })

    labelDatas.forEach(labelData => {
      labelData.color = primaryColor
      const { billboard, ballItem } = createLabelAndLine(labelData);
      const index = labels.length
      labels.push(billboard)
      balls.push(ballItem)
      // labelTree.addChild(billboard, false);

      ballItem.getParameter('Visible').setValue(false)
      billboard.getParameter('Visible').setValue(false)
      labelTree.addChild(ballItem, true);

      ballItem.mouseDown.connect(()=>{
        setLabelVisible(index)
      })
    })

    return {
      visibleParam
    }
  }
  const state = -1;
  //////////////////////////////////////////////////////////////
  // State 1
  const state1Labels = addLabelSet("state1Labels", [
    { pos: new ZeaEngine.Vec3(0, -0.19, 0.16), basePos: new ZeaEngine.Vec3(0, -0.19, 0.05), name:"Resovoir" },
    { pos: new ZeaEngine.Vec3(0.008, -0.21, 0.16), basePos: new ZeaEngine.Vec3(0.008, -0.21, 0.0), name:"Cylinder" },
    { pos: new ZeaEngine.Vec3(0, -0.07, 0.16), basePos: new ZeaEngine.Vec3(0, -0.07, 0.10), name:"Booster" },
    { pos: new ZeaEngine.Vec3(0.008, 0.07, 0.16), basePos: new ZeaEngine.Vec3(0.008, 0.07, 0.0), name:"Pushrod" }
  ]);
  if (state == 1) {
    state1Labels.visibleParam.setValue(true)
  }
  //////////////////////////////////////////////////////////////
  // State 2
  
  const state2Labels = addLabelSet("state2Labels", [
    { pos:new ZeaEngine.Vec3(0.008, -0.26, 0.1), basePos: new ZeaEngine.Vec3(0.008, -0.26, 0.0), name:"PressureChamber" },
    { pos:new ZeaEngine.Vec3(0.008, -0.21, 0.1), basePos: new ZeaEngine.Vec3(0.008, -0.21, 0.0), name:"SecondaryPiston" },
    { pos:new ZeaEngine.Vec3(0.008, -0.13, 0.1), basePos: new ZeaEngine.Vec3(0.008, -0.13, 0.0), name:"PrimaryPiston" },
    { pos:new ZeaEngine.Vec3(0.0, -0.237, 0.1), basePos: new ZeaEngine.Vec3(0.0, -0.237, 0.013), name:"VentPort", ballRadius:0.5 },
    { pos:new ZeaEngine.Vec3(0.0, -0.2245, 0.1), basePos: new ZeaEngine.Vec3(0.0, -0.2245, 0.013), name:"ReplenishingPort", ballRadius:0.5 }
  ]);

  
  asset.getParameter('CutPlaneColor').setValue(new ZeaEngine.Color(0, 0, 0))
  asset.getParameter('CutPlaneNormal').setValue(new ZeaEngine.Vec3(1, 0, 0))
  const cutAwayGroup = new ZeaEngine.Group('cutAwayGroup');
  // cutAwayGroup.getParameter('CutVector').setValue(), new Vec3(1, 0, 0)),
  // cutAwayGroup.getParameter('CutDist').setValue(), 0.0),
  asset.getParameter('CutPlaneDist').setValue(-0.2)
  asset.addChild(cutAwayGroup);
  
  asset.loaded.connect(() => {
    cutAwayGroup.resolveItems([
      [".", "SJ Cilindro MESTRE", "cilindro_mestre"],
      [".", "SJ Cilindro MESTRE", "tanque_fluido"],
      [".", "bacia_1"],
      [".", "SJ Cilindro MESTRE", "Bucha_tanque"],
      [".", "SJ Cilindro MESTRE", "secundario"],
      [".", "SJ Cilindro MESTRE", "bucha_freio"],
      [".", "SJ Cilindro MESTRE", "1.2"],
      [".", "bacia_2"],
      [".", "disco_dinamico"],
      [".", "Part1"],
      [".", "Symmetry of Part1.8.2"],
      [".", "SJ Cilindro MESTRE", "anel_borracha"],
    ]);
  })
  // if (state == 2) {
  //   asset.loaded.connect(() => {
  //     cutAwayGroup.getParameter('CutAwayEnabled').setValue(true);  
  //     const cutDist = asset.getParameter('CutPlaneDist');
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
  const boosterAndPedalGroup = new ZeaEngine.Group('boosterAndPedalGroup');
  // boosterAndPedalGroup.getParameter('Highlighted').setValue(true);  
  asset.addChild(boosterAndPedalGroup);
  
  asset.loaded.connect(() => {
    boosterAndPedalGroup.resolveItems([
      [".", "bacia_1"],
      [".", "bacia_2"],
      [".", "disco_dinamico"],
      [".", "Part1"],
      [".", "Symmetry of Part1"],
      [".", "Symmetry of Part1.8.2"],
      [".", "Symmetry of Symmetry of Part1"],
      [".", "haste_acionamento"],
      [".", "Pedal_de freio"],
      [".", "mola11"],
      [".", "mola12"],
      [".", "filtro_ar"],
      [".", "bucha_vacuo"],
      [".", "tubo_vacuo"],
      [".", "haste_vacuo"],
      [".", "bucha_vedada"],
      [".", "prato"],
      [".", "paraf_m6"],
      [".", "SJ Cilindro MESTRE", "porca_m6.1"],
      [".", "Part1.1"],
      [".", "SJ Cilindro MESTRE", "porca_m6"],
    ]);
  })
  

  const explodedPartsOp = new ZeaEngine.ExplodePartsOperator('ExplodeParts');
  asset.addComponent(explodedPartsOp);
  explodedPartsOp.getParameter('Dist').setValue(0.5);
  explodedPartsOp.getParameter('Cascade').setValue(true);
  const parts = explodedPartsOp.getParameter('Parts')
  const explodeDir = new ZeaEngine.Vec3(0, 1, 0)
  const explodeFrontSideDir = new ZeaEngine.Vec3(0.4, 0, 0)
  const explodeBackSideDir = new ZeaEngine.Vec3(-0.4, 0, 0)
  const explodeTopDir = new ZeaEngine.Vec3(0, 0, 0.4)

  {
    const part = parts.addElement();
    part.getOutput().setParam(asset.resolvePath(["SJ Cilindro MESTRE", "Anel Trava", "GlobalXfo"]))
    part.getParameter('Axis').setValue(explodeDir)
  }
  {
    const part = parts.addElement();
    part.getOutput().setParam(asset.resolvePath(["SJ Cilindro MESTRE", "Vedante", "GlobalXfo"]))
    part.getParameter('Axis').setValue(explodeDir)
  }
  {
    const part = parts.addElement();
    part.getOutput().setParam(asset.resolvePath(["SJ Cilindro MESTRE", "anel_borracha", "GlobalXfo"]))
    part.getParameter('Axis').setValue(explodeDir)
    part.getParameter('Stage').setValue(part.getParameter('Stage').getValue() - 0.25);
  }
  {
    const part = parts.addElement();
    part.getOutput().setParam(asset.resolvePath(["SJ Cilindro MESTRE", "Cilindro2", "GlobalXfo"]))
    part.getParameter('Axis').setValue(explodeDir)
    part.getParameter('Stage').setValue(part.getParameter('Stage').getValue() + 1.4);
  }
  {
    const part = parts.addElement();
    part.getOutput().setParam(asset.resolvePath(["SJ Cilindro MESTRE", "secundaria.1", "GlobalXfo"]))
    part.getParameter('Axis').setValue(explodeDir)
    part.getParameter('Stage').setValue(part.getParameter('Stage').getValue() - 0.25);
  }
  {
    const part = parts.addElement();
    part.getOutput().setParam(asset.resolvePath(["SJ Cilindro MESTRE", "mola2", "GlobalXfo"]))
    part.getParameter('Axis').setValue(explodeDir)
    part.getParameter('Stage').setValue(part.getParameter('Stage').getValue() - 0.75);
  }
  {
    const part = parts.addElement();
    part.getOutput().setParam(asset.resolvePath(["SJ Cilindro MESTRE", "bucha_guia", "GlobalXfo"]))
    part.getParameter('Axis').setValue(explodeDir)
  }
  {
    const part = parts.addElement();
    part.getOutput().setParam(asset.resolvePath(["SJ Cilindro MESTRE", "secundaria", "GlobalXfo"]))
    part.getParameter('Axis').setValue(explodeDir)
    part.getParameter('Stage').setValue(part.getParameter('Stage').getValue() - 0.75);
  }
  {
    const part = parts.addElement();
    part.getOutput().setParam(asset.resolvePath(["SJ Cilindro MESTRE", "cilind", "GlobalXfo"]))
    part.getParameter('Axis').setValue(explodeDir)
    part.getParameter('Stage').setValue(part.getParameter('Stage').getValue() - 0.25);
  }
  {
    const part = parts.addElement();
    part.getOutput().setParam(asset.resolvePath(["SJ Cilindro MESTRE", "gaxeta", "GlobalXfo"]))
    part.getParameter('Axis').setValue(explodeDir)
    part.getParameter('Stage').setValue(part.getParameter('Stage').getValue() + 0.25);
  }
  {
    const part = parts.addElement();
    part.getOutput().setParam(asset.resolvePath(["SJ Cilindro MESTRE", "mola1", "GlobalXfo"]))
    part.getParameter('Axis').setValue(explodeDir)
  }
  {
    const part = parts.addElement();
    part.getOutput().setParam(asset.resolvePath(["SJ Cilindro MESTRE", "bucha_freio", "GlobalXfo"]))
    part.getParameter('Axis').setValue(explodeFrontSideDir)
    part.getParameter('Stage').setValue(11);
  }
  {
    const part = parts.addElement();
    part.getOutput().setParam(asset.resolvePath(["SJ Cilindro MESTRE", "1.2", "GlobalXfo"]))
    part.getParameter('Axis').setValue(explodeFrontSideDir)
    part.getParameter('Stage').setValue(11);
  }
  {
    const part = parts.addElement();
    part.getOutput().setParam(asset.resolvePath(["SJ Cilindro MESTRE", "1.1", "GlobalXfo"]))
    part.getParameter('Axis').setValue(explodeBackSideDir)
    part.getParameter('Stage').setValue(11);
  }
  {
    const part = parts.addElement();
    part.getOutput().setParam(asset.resolvePath(["SJ Cilindro MESTRE", "1.3", "GlobalXfo"]))
    part.getParameter('Axis').setValue(explodeBackSideDir)
    part.getParameter('Stage').setValue(11);
  }
  {
    const part = parts.addElement();
    part.getOutput().setParam(asset.resolvePath(["SJ Cilindro MESTRE", "tampa_tanque", "GlobalXfo"]))
    part.getParameter('Axis').setValue(explodeTopDir)
    part.getParameter('Stage').setValue(9);
  }
  {
    const part = parts.addElement();
    part.getOutput().setParam(asset.resolvePath(["SJ Cilindro MESTRE", "tanque_fluido", "GlobalXfo"]))
    part.getParameter('Axis').setValue(explodeTopDir)
    part.getParameter('Stage').setValue(11);
  }
  {
    const part = parts.addElement();
    part.getOutput().setParam(asset.resolvePath(["SJ Cilindro MESTRE", "secundario", "GlobalXfo"]))
    part.getParameter('Axis').setValue(explodeTopDir)
    part.getParameter('Stage').setValue(13);
  }
  {
    const part = parts.addElement();
    part.getOutput().setParam(asset.resolvePath(["SJ Cilindro MESTRE", "Bucha_tanque", "GlobalXfo"]))
    part.getParameter('Axis').setValue(explodeTopDir)
    part.getParameter('Stage').setValue(13);
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

  // renderer.getViewport().getCamera().globalXfoChanged.connect(()=>{
  //   const xfo = renderer.getViewport().getCamera().getGlobalXfo()
  //   const target = renderer.getViewport().getCamera().getTargetPostion()
  //   console.log(xfo.toString(), target.toString())
  // })
  
  const stateMachine = new ZeaEngine.StateMachine();
  asset.addComponent(stateMachine);
  
  {
    const Stage1State = new ZeaEngine.State('Stage1State');
    
    ///////////////
    // State Events
    const nextStateKeyPressed = new ZeaEngine.KeyPressedEvent('NextStateKey');
    Stage1State.addStateEvent(nextStateKeyPressed)
    nextStateKeyPressed.getParameter('Key').setValue('>')
    
    const SwitchToStage1State = new ZeaEngine.SwitchState();
    nextStateKeyPressed.addChild(SwitchToStage1State)
    SwitchToStage1State.getParameter('TargetState').setValue('Stage2State')

    ///////////////////////////////
    // State Activation Actions

    const ShowBoosterAndPedal = new ZeaEngine.SetParameterValue()
    Stage1State.addActivationAction(ShowBoosterAndPedal)
    ShowBoosterAndPedal.getParameter('InterpTime').setValue(0.0)
    ShowBoosterAndPedal.getOutput('Param').setParam(boosterAndPedalGroup.getParameter('Visible'))
    ShowBoosterAndPedal.getParameter('Value').setValue(true)

    
    const SetCameraPositionAndTarget = new ZeaEngine.SetCameraPositionAndTarget()
    Stage1State.addActivationAction(SetCameraPositionAndTarget)
    SetCameraPositionAndTarget.getParameter('Camera').setValue(renderer.getViewport().getCamera())
    SetCameraPositionAndTarget.getParameter('interpTime').setValue(1.0)
    SetCameraPositionAndTarget.getParameter('cameraPos').setValue(new ZeaEngine.Vec3({"x":0.57098,"y":-0.02572,"z":0.10281}))
    SetCameraPositionAndTarget.getParameter('cameraTarget').setValue(new ZeaEngine.Vec3({"x":0.00207,"y":-0.03195,"z":0.03585}))
    
    const EnableLabels = new ZeaEngine.SetParameterValue()
    // Stage1State.addActivationAction(EnableLabels)
    SetCameraPositionAndTarget.addChild(EnableLabels)
    EnableLabels.getParameter('InterpTime').setValue(0.0)
    EnableLabels.getOutput('Param').setParam(state1Labels.visibleParam)
    EnableLabels.getParameter('Value').setValue(true)

    ///////////////////////////////
    // State Deactivation Actions
    const DisableLabels = new ZeaEngine.SetParameterValue()
    Stage1State.addDeactivationAction(DisableLabels)
    DisableLabels.getParameter('InterpTime').setValue(0.0)
    DisableLabels.getOutput('Param').setParam(state1Labels.visibleParam)
    DisableLabels.getParameter('Value').setValue(false)

    stateMachine.addState(Stage1State);
  }

  {
    const Stage2State = new ZeaEngine.State('Stage2State');

    ///////////////
    // State Events
    const nextStateKeyPressed = new ZeaEngine.KeyPressedEvent();
    Stage2State.addStateEvent(nextStateKeyPressed)
    nextStateKeyPressed.getParameter('Key').setValue('>')
    const SwitchToStage3State = new ZeaEngine.SwitchState();
    nextStateKeyPressed.addChild(SwitchToStage3State)
    SwitchToStage3State.getParameter('TargetState').setValue('Stage3State')

    const prevStateKeyPressed = new ZeaEngine.KeyPressedEvent();
    Stage2State.addStateEvent(prevStateKeyPressed)
    prevStateKeyPressed.getParameter('Key').setValue('<')
    const SwitchToStage1State = new ZeaEngine.SwitchState();
    prevStateKeyPressed.addChild(SwitchToStage1State)
    SwitchToStage1State.getParameter('TargetState').setValue('Stage1State')

    ///////////////////////////////
    // State Activation Actions
    const HideBoosterAndPedal = new ZeaEngine.SetParameterValue()
    Stage2State.addActivationAction(HideBoosterAndPedal)
    HideBoosterAndPedal.getParameter('InterpTime').setValue(0.0)
    HideBoosterAndPedal.getOutput('Param').setParam(boosterAndPedalGroup.getParameter('Visible'))
    HideBoosterAndPedal.getParameter('Value').setValue(false)

    const EnableCutaway = new ZeaEngine.SetParameterValue('EnableCutaway')
    Stage2State.addActivationAction(EnableCutaway)
    EnableCutaway.getParameter('InterpTime').setValue(0.0)
    EnableCutaway.getOutput('Param').setParam(cutAwayGroup.getParameter('CutAwayEnabled'))
    EnableCutaway.getParameter('Value').setValue(true)
    
    const CutAwayMasterCylinder = new ZeaEngine.SetParameterValue('CutAwayMasterCylinder')
    Stage2State.addActivationAction(CutAwayMasterCylinder)
    CutAwayMasterCylinder.getParameter('InterpTime').setValue(1.0)
    CutAwayMasterCylinder.getOutput('Param').setParam(asset.getParameter('CutPlaneDist'))
    CutAwayMasterCylinder.getParameter('Value').setValue(0.0)
    
    const SetCameraPositionAndTarget = new ZeaEngine.SetCameraPositionAndTarget()
    Stage2State.addActivationAction(SetCameraPositionAndTarget)
    SetCameraPositionAndTarget.getParameter('Camera').setValue(renderer.getViewport().getCamera())
    SetCameraPositionAndTarget.getParameter('interpTime').setValue(1.0)
    SetCameraPositionAndTarget.getParameter('cameraPos').setValue(new ZeaEngine.Vec3({"x":0.31458,"y":-0.17705,"z":0.09557}))
    SetCameraPositionAndTarget.getParameter('cameraTarget').setValue(new ZeaEngine.Vec3({"x":0.00902,"y":-0.16664,"z":0.07171}))
    
    const EnableLabels = new ZeaEngine.SetParameterValue('EnableLabels')
    // Stage2State.addActivationAction(EnableLabels)
    SetCameraPositionAndTarget.addChild(EnableLabels)
    EnableLabels.getParameter('InterpTime').setValue(0.0)
    EnableLabels.getOutput('Param').setParam(state2Labels.visibleParam)
    EnableLabels.getParameter('Value').setValue(true)


    ///////////////////////////////
    // State Deactivation Actions
    const DisableLabels = new ZeaEngine.SetParameterValue('DisableLabels')
    Stage2State.addDeactivationAction(DisableLabels)
    DisableLabels.getParameter('InterpTime').setValue(0.0)
    DisableLabels.getOutput('Param').setParam(state2Labels.visibleParam)
    DisableLabels.getParameter('Value').setValue(false)

    const DisableCutaway = new ZeaEngine.SetParameterValue('DisableCutaway')
    Stage2State.addDeactivationAction(DisableCutaway)
    DisableCutaway.getParameter('InterpTime').setValue(0.0)
    DisableCutaway.getOutput('Param').setParam(cutAwayGroup.getParameter('CutAwayEnabled'))
    DisableCutaway.getParameter('Value').setValue(false)

    const UnCutAwayMasterCylinder = new ZeaEngine.SetParameterValue('UnCutAwayMasterCylinder')
    Stage2State.addDeactivationAction(UnCutAwayMasterCylinder)
    UnCutAwayMasterCylinder.getParameter('InterpTime').setValue(0.5)
    UnCutAwayMasterCylinder.getOutput('Param').setParam(asset.getParameter('CutPlaneDist'))
    UnCutAwayMasterCylinder.getParameter('Value').setValue(-0.2)

    stateMachine.addState(Stage2State)
  }
  
  {
    const Stage3State = new ZeaEngine.State('Stage3State');

    ///////////////
    // State Events
    const prevStateKeyPressed = new ZeaEngine.KeyPressedEvent('PrevStateKey');
    Stage3State.addStateEvent(prevStateKeyPressed)
    prevStateKeyPressed.getParameter('Key').setValue('<')
    const SwitchToStage1State = new ZeaEngine.SwitchState();
    prevStateKeyPressed.addChild(SwitchToStage1State)
    SwitchToStage1State.getParameter('TargetState').setValue('Stage2State')

    ///////////////////////////////
    // State Activation Actions
    const Explode = new ZeaEngine.SetParameterValue('Explode')
    Stage3State.addActivationAction(Explode)
    Explode.getParameter('InterpTime').setValue(2.0)
    Explode.getOutput('Param').setParam(explodedPartsOp.getParameter('Explode'))
    Explode.getParameter('Value').setValue(1.0)
  
    // const EnableLabels = new ZeaEngine.SetParameterValue('EnableLabels')
    // Stage3State.addActivationAction(EnableLabels)
    // EnableLabels.getParameter('InterpTime').setValue(0.0)
    // EnableLabels.getOutput('Param').setParam(state2Labels.visibleParam)
    // EnableLabels.getParameter('Value').setValue(true)

    const SetCameraPositionAndTarget = new ZeaEngine.SetCameraPositionAndTarget()
    Stage3State.addActivationAction(SetCameraPositionAndTarget)
    SetCameraPositionAndTarget.getParameter('Camera').setValue(renderer.getViewport().getCamera())
    SetCameraPositionAndTarget.getParameter('interpTime').setValue(1.0)
    SetCameraPositionAndTarget.getParameter('cameraPos').setValue(new ZeaEngine.Vec3({"x":0.40108,"y":0.47376,"z":0.27948}))
    SetCameraPositionAndTarget.getParameter('cameraTarget').setValue(new ZeaEngine.Vec3({"x":-0.03933,"y":0.07561,"z":0.01556}))

    ///////////////////////////////
    // State Deactivation Actions

    const UnExplode = new ZeaEngine.SetParameterValue('UnExplode')
    Stage3State.addDeactivationAction(UnExplode)
    UnExplode.getParameter('InterpTime').setValue(0.5)
    UnExplode.getOutput('Param').setParam(explodedPartsOp.getParameter('Explode'))
    UnExplode.getParameter('Value').setValue(0.0)
    
    // const DisableLabels = new ZeaEngine.SetParameterValue('DisableLabels')
    // Stage3State.addDeactivationAction(DisableLabels)
    // DisableLabels.getParameter('InterpTime').setValue(0.0)
    // DisableLabels.getOutput('Param').setParam(state2Labels.visibleParam)
    // DisableLabels.getParameter('Value').setValue(false)

    stateMachine.addState(Stage3State)
  }
  
  stateMachine.setInitialState('Stage1State');
  stateMachine.activateState('Stage1State', false);
  
}