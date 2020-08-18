
// https://material.io/design/color/#tools-for-picking-colors
// Yellow 50


function setupIdentification(scene, asset, renderer, appData) {

  const primaryColor = new ZeaEngine.Color('#FBC02D');

  const labelLinesMaterial = new ZeaEngine.Material('LabelLinesMaterial', 'HandleShader');
  // labelLinesMaterial.getParameter('Color').setValue(new ZeaEngine.Color(0, 0, 0))
  labelLinesMaterial.getParameter('BaseColor').setValue(primaryColor)
  const dir = new ZeaEngine.Vec3(1, 0, 0)
  const up = new ZeaEngine.Vec3(0, 0, 1)

  const labelTree = new ZeaEngine.TreeItem("labelTree");
  scene.getRoot().addChild(labelTree);
  const createLabels = (labelDatas) => {
    labelDatas.forEach(labelData => {
      console.log("createLabels", labelData.name)
      labelData.color = primaryColor
      const { ballItem } = DOMLabel.createLabelAndLine(labelData);

      const handle = new appData.UX.PlanarMovementHandle();
      handle.setGlobalXfo(ballItem.getGlobalXfo())
      const handleXfo = new ZeaEngine.Xfo(labelData.basePos)
      handleXfo.ori.setFromDirectionAndUpvector(dir, up)
      handle.setLocalXfo(handleXfo);
      // handle.setTargetParam(handle.getParameter("GlobalXfo"), false)

      handle.addChild(ballItem, true);
      labelTree.addChild(handle, true);
    })
  }
  
  const offset = new ZeaEngine.Vec3(0, 0, 0.1);
  createLabels([
    { basePos: new ZeaEngine.Vec3(0, 0.3, 0.2), offset, name:"ResovoirS", width: 200 },
    { basePos: new ZeaEngine.Vec3(0.0, 0.2, 0.2), offset, name:"PrimaryPistonS", width: 200 },
    { basePos: new ZeaEngine.Vec3(0.0, 0.1, 0.2), offset, name:"SecondaryPistonS", width: 200 },
    { basePos: new ZeaEngine.Vec3(0.0, 0, 0.2), offset, name:"SealS", width: 200 },
    { basePos: new ZeaEngine.Vec3(0.0, -0.1, 0.2), offset, name:"PrimaryReturnSpringS", width: 200 },
    { basePos: new ZeaEngine.Vec3(0.0, -0.2, 0.2), offset, name:"SecondaryReturnSpringS", width: 200 }
  ]);

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

  boosterAndPedalGroup.getParameter('Visible').setValue(false);  
  let explodedAmount = 0;
  const param = explodedPartsOp.getParameter('Explode');
  const timerCallback = () => {
      // Check to see if the video has progressed to the next frame. 
      // If so, then we emit and update, which will cause a redraw.
      animatingValue = true;
      explodedAmount += 0.02;
      // console.log(explodedAmount)
      param.setValue(explodedAmount);
      // renderer.requestRedraw();
      if (explodedAmount < 1.0) {
          timeoutId = setTimeout(timerCallback, 20); // Sample at 50fps.
      }
      animatingValue = false;
  };
  timeoutId = setTimeout(timerCallback, 100); // half second delay


  // renderer.getViewport().getCamera().globalXfoChanged.connect(()=>{
  //   const xfo = renderer.getViewport().getCamera().getGlobalXfo()
  //   const target = renderer.getViewport().getCamera().getTargetPostion()
  //   console.log(xfo.toString(), target.toString())
  // })
  const position = new ZeaEngine.Vec3({"x":0.50854,"y":0.13737,"z":0.10604})
  const target = new ZeaEngine.Vec3({"x":0.02116,"y":0.05867,"z":0.15426})
  renderer.getViewport().getCamera().setPositionAndTarget(position, target);
  
}