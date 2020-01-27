

const displayDebug = false
function setupPlugAndSocket(asset, name, xfo, radius, slideDist, plugLength, radialConstraint, geomItem, appData, dependentSockets, parent) {
  const socket = new SocketItem(name, displayDebug);
  socket.getParameter("GlobalXfo").setValue(xfo)
  socket.getParameter("Size").setValue(radius * 5)
  socket.getParameter("Radius").setValue(radius)
  socket.getParameter("SlideDist").setValue(slideDist)
  if (plugLength > 0.0)
    socket.getParameter("AxialFlip").setValue(true)

  if (radialConstraint)
    socket.getParameter("RadialConstraint").setValue(radialConstraint)
    
  if (dependentSockets) {
    dependentSockets.forEach(dependentSocket => {
      socket.addDependentSocket(dependentSocket)
    });
  }
  
  if (parent)
    parent.addChild(socket);
  else 
    asset.addChild(socket);

  const plug = new PlugItem(name+"Plug", displayDebug);
  plug.getParameter("Size").setValue(radius * 5)
  plug.getParameter("Length").setValue(plugLength)
  const plugXfo = xfo.clone()
  plug.getParameter("GlobalXfo").setValue(plugXfo)
  if (geomItem)
    plug.addItem(geomItem);
  plug.sockets.push(socket)
  // asset.addChild(plug);

  const dir = new ZeaEngine.Vec3(1, 0, 0)
  const up = new ZeaEngine.Vec3(0, 0, 1)
  const handle = new appData.UX.PlanarMovementHandle();
  const handleXfo = xfo.clone()
  handleXfo.ori.setFromDirectionAndUpvector(dir, up)
  handle.setLocalXfo(handleXfo);
  handle.addChild(plug, true);
  
  // const handle = new appData.UX.ScreenSpaceMovementHandle();
  // handle.setGlobalXfo(plug.getGlobalXfo())
  // handle.addChild(plug, true);
  // handle.setTargetParam(plug.getParameter("GlobalXfo"), false)

  asset.addChild(handle);

  return {socket, plug};
}

function setupAssembly(scene, asset, renderer, appData) {
  
  // renderer.getViewport().getCamera().globalXfoChanged.connect(()=>{
  //   const xfo = renderer.getViewport().getCamera().getGlobalXfo()
  //   const target = renderer.getViewport().getCamera().getTargetPostion()
  //   console.log(xfo.toString(), target.toString())
  // })
  const position = new ZeaEngine.Vec3({"x":0.91666,"y":-0.05792,"z":0.12469})
  const target = new ZeaEngine.Vec3({"x":0.02931,"y":-0.12152,"z":0.04089})
  renderer.getViewport().getCamera().setPositionAndTarget(position, target);
  
  const boosterAndPedalGroup = new ZeaEngine.Group('boosterAndPedalGroup');
  // boosterAndPedalGroup.getParameter('Highlighted').setValue(true);  
  boosterAndPedalGroup.getParameter('Visible').setValue(false);  
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
      [".", "SJ Cilindro MESTRE", "anel_borracha"],
    ]);
  })
  

  // const applyCutaway = false
  // if (applyCutaway) {
    asset.getParameter('CutPlaneColor').setValue(new ZeaEngine.Color(0, 0, 0))
    asset.getParameter('CutPlaneNormal').setValue(new ZeaEngine.Vec3(1, 0, 0))
    const cutAwayGroup = new ZeaEngine.Group('cutAwayGroup');
    asset.getParameter('CutPlaneDist').setValue(-0.2)
    asset.addChild(cutAwayGroup);
    
    cutAwayGroup.resolveItems([
      [".", "SJ Cilindro MESTRE", "cilindro_mestre"],
      [".", "SJ Cilindro MESTRE", "bucha_freio"],
      [".", "SJ Cilindro MESTRE", "1.1"],
      [".", "SJ Cilindro MESTRE", "1.2"],
      [".", "SJ Cilindro MESTRE", "1.3"],
    ]);
    
    // cutAwayGroup.getParameter('CutAwayEnabled').setValue(true);  
    // asset.getParameter('CutPlaneDist').setValue(0.0)
  // }
  
  const plugs = {}
  {
    let masterCylinderGroup;
    {
      masterCylinderGroup = new ZeaEngine.Group('masterCylinderGroup');
      const item = asset.resolvePath(["SJ Cilindro MESTRE", "cilindro_mestre"]);
      masterCylinderGroup.addItem(item);
      masterCylinderGroup.addItem(asset.resolvePath(["SJ Cilindro MESTRE", "1.1"]));
      masterCylinderGroup.addItem(asset.resolvePath(["SJ Cilindro MESTRE", "1.2"]));
      masterCylinderGroup.addItem(asset.resolvePath(["SJ Cilindro MESTRE", "1.3"]));
      masterCylinderGroup.addItem(asset.resolvePath(["SJ Cilindro MESTRE", "bucha_freio"]));
      const dir = new ZeaEngine.Vec3(1, 0, 0)
      const up = new ZeaEngine.Vec3(0, 0, 1)
      const handle = new appData.UX.PlanarMovementHandle();
      const handleXfo = new ZeaEngine.Xfo()
      handleXfo.tr = item.getParameter("GlobalXfo").getValue().tr
      handleXfo.ori.setFromDirectionAndUpvector(dir, up)
      handle.setLocalXfo(handleXfo);
      handle.addChild(masterCylinderGroup, true);
      
      asset.addChild(handle);

      plugs.masterCylinder = { plug: handle }
    }

    {
      const xfo = new ZeaEngine.Xfo()
      xfo.ori.setFromDirectionAndUpvector(new ZeaEngine.Vec3(0, 0, 1), new ZeaEngine.Vec3(1, 0, 0))
      xfo.tr.set(0.0, -0.231, 0.015)
      const item = asset.resolvePath(["SJ Cilindro MESTRE", "Bucha_tanque"])
      const data = setupPlugAndSocket(asset, "fluidResovoirPlug1", xfo, 0.007, 0.015, 0, Math.PI*2, item, appData, [
      ], masterCylinderGroup)
      plugs.fluidResovoirPlug1 = data;
    }
    {
      const xfo = new ZeaEngine.Xfo()
      xfo.ori.setFromDirectionAndUpvector(new ZeaEngine.Vec3(0, 0, 1), new ZeaEngine.Vec3(1, 0, 0))
      xfo.tr.set(0.0, -0.141, 0.015)
      const item = asset.resolvePath(["SJ Cilindro MESTRE", "secundario"])
      const data = setupPlugAndSocket(asset, "fluidResovoirPlug2", xfo, 0.007, 0.015, 0, Math.PI*2, item, appData, [
      ], masterCylinderGroup)
      plugs.fluidResovoirPlug2 = data;
    }
    {
      const xfo = new ZeaEngine.Xfo()
      xfo.ori.setFromDirectionAndUpvector(new ZeaEngine.Vec3(0, 0, 1), new ZeaEngine.Vec3(1, 0, 0))
      xfo.tr.set(0.0, -0.2, 0.02)
      const item = asset.resolvePath(["SJ Cilindro MESTRE", "tanque_fluido"])
      const data = setupPlugAndSocket(asset, "fluidResovoir", xfo, 0.007, 0.01, 0, 0, item, appData, [
        plugs.fluidResovoirPlug1.socket,
        plugs.fluidResovoirPlug2.socket
      ], masterCylinderGroup)
      plugs.fluidResovoir = data;
    }
    
    plugs.fluidResovoirPlug1.plug.addConnectableSocket(plugs.fluidResovoirPlug2.socket)
    plugs.fluidResovoirPlug2.plug.addConnectableSocket(plugs.fluidResovoirPlug1.socket)

    {
      const xfo = new ZeaEngine.Xfo()
      const dir = new ZeaEngine.Vec3(0, -0.25, 1);
      dir.normalizeInPlace()
      xfo.ori.setFromDirectionAndUpvector(dir, new ZeaEngine.Vec3(1, 0, 0))
      xfo.tr.set(0.0, -0.157, 0.08)
      const item = asset.resolvePath(["SJ Cilindro MESTRE", "tampa_tanque"])
      const data = setupPlugAndSocket(asset, "fluidResovoirCap", xfo, 0.007, 0.005, 0, Math.PI*2, item, appData, [
      ], plugs.fluidResovoir.plug)
      plugs.fluidResovoirCap = data;
    }

    
    {
      const xfo = new ZeaEngine.Xfo()
      xfo.ori.setFromDirectionAndUpvector(new ZeaEngine.Vec3(0, 1, 0), new ZeaEngine.Vec3(0, 0, 1))
      xfo.tr.set(0.0, -0.288, 0.0)
      const item = asset.resolvePath(["SJ Cilindro MESTRE", "mola1"])
      const data = setupPlugAndSocket(asset, "secondaryPistonSocket", xfo, 0.007, 0.175, 0.055, Math.PI*2, item, appData, [
      ], masterCylinderGroup)
      plugs.secondarySpring = data;
    }
    
    {
      const xfo = new ZeaEngine.Xfo()
      xfo.ori.setFromDirectionAndUpvector(new ZeaEngine.Vec3(0, 1, 0), new ZeaEngine.Vec3(0, 0, 1))
      xfo.tr.set(0.0, -0.2325, 0.0)
      const item = asset.resolvePath(["SJ Cilindro MESTRE", "cilind"])
      const data = setupPlugAndSocket(asset, "secondaryPistonSocket", xfo, 0.007, 0.12, 0.0, Math.PI*2, item, appData, [
        plugs.secondarySpring.socket
      ], masterCylinderGroup)
      plugs.secondaryPistonSocket = data;
    }

    {
      const xfo = new ZeaEngine.Xfo()
      xfo.ori.setFromDirectionAndUpvector(new ZeaEngine.Vec3(0, -1, 0), new ZeaEngine.Vec3(0, 0, 1))
      xfo.tr.set(0.0, -0.229, 0.0)
      const item = asset.resolvePath(["SJ Cilindro MESTRE", "gaxeta"])
      const data = setupPlugAndSocket(asset, "secondaryPistonEndSeal", xfo, 0.007, 0.025, 0.0035, Math.PI*2, item, appData, [

      ], plugs.secondaryPistonSocket.plug)
      plugs.secondaryPistonEndSeal = data;

      plugs.secondaryPistonSocket.socket.addDependentSocket(data.socket)
    }
    
    {
      const xfo = new ZeaEngine.Xfo()
      xfo.ori.setFromDirectionAndUpvector(new ZeaEngine.Vec3(0, 1, 0), new ZeaEngine.Vec3(0, 0, 1))
      xfo.tr.set(0.0, -0.195, 0.0)
      const item = asset.resolvePath(["SJ Cilindro MESTRE", "secundaria"])
      const data = setupPlugAndSocket(asset, "secondaryPistonRamSeal", xfo, 0.007, 0.085, 0.0035, Math.PI*2, item, appData, [
        plugs.secondaryPistonSocket.socket
      ], masterCylinderGroup)
      plugs.secondaryPistonRamSeal = data;
    }
    
    {
      const xfo = new ZeaEngine.Xfo()
      xfo.ori.setFromDirectionAndUpvector(new ZeaEngine.Vec3(0, 1, 0), new ZeaEngine.Vec3(0, 0, 1))
      xfo.tr.set(0.0, -0.19, 0.0)
      const item = asset.resolvePath(["SJ Cilindro MESTRE", "bucha_guia"])
      const data = setupPlugAndSocket(asset, "secondaryPistonStartRamSocket", xfo, 0.007, 0.085, 0, Math.PI*2, item, appData, [
        plugs.secondaryPistonRamSeal.socket
      ], masterCylinderGroup)
      plugs.secondaryPistonStartRamSocket = data;
    }

    {
        const xfo = new ZeaEngine.Xfo()
        xfo.ori.setFromDirectionAndUpvector(new ZeaEngine.Vec3(0, 1, 0), new ZeaEngine.Vec3(0, 0, 1))
        xfo.tr.set(0.0, -0.188, 0.0)
        const item = asset.resolvePath(["SJ Cilindro MESTRE", "mola2"])
        const data = setupPlugAndSocket(asset, "primarySpringSocket", xfo, 0.007, 0.077, 0.045, Math.PI*2, item, appData, [
          plugs.secondaryPistonStartRamSocket.socket
        ], masterCylinderGroup)
        plugs.primarySpringSocket = data;
    }
    
    {
      const xfo = new ZeaEngine.Xfo()
      xfo.ori.setFromDirectionAndUpvector(new ZeaEngine.Vec3(0, 1, 0), new ZeaEngine.Vec3(0, 0, 1))
      xfo.tr.set(0.0, -0.14, 0.0)
      const item = asset.resolvePath(["SJ Cilindro MESTRE", "Cilindro2"])
      const data = setupPlugAndSocket(asset, "primaryPiston", xfo, 0.007, 0.03, 0, Math.PI*2, item, appData, [
        plugs.primarySpringSocket.socket
      ], masterCylinderGroup)
      plugs.primaryPiston = data;
    }
    
    {
      const xfo = new ZeaEngine.Xfo()
      xfo.ori.setFromDirectionAndUpvector(new ZeaEngine.Vec3(0, -1, 0), new ZeaEngine.Vec3(0, 0, 1))
      xfo.tr.set(0.0, -0.139, 0.0)
      const item = asset.resolvePath(["SJ Cilindro MESTRE", "secundaria.1"])
      const data = setupPlugAndSocket(asset, "primaryPistonEndSeal", xfo, 0.007, 0.01, 0.004, Math.PI*2, item, appData, [

      ], plugs.primaryPiston.plug)
      plugs.primaryPistonEndSeal = data;
      
      plugs.primaryPiston.socket.addDependentSocket(data.socket)
    }


    {
      const xfo = new ZeaEngine.Xfo()
      xfo.ori.setFromDirectionAndUpvector(new ZeaEngine.Vec3(0, 1, 0), new ZeaEngine.Vec3(0, 0, 1))
      xfo.tr.set(0.0, -0.118, 0.0)
      const item = asset.resolvePath(["SJ Cilindro MESTRE", "Vedante"])
      const data = setupPlugAndSocket(asset, "primaryPistonStartSeal", xfo, 0.007, 0.06, 0.004, Math.PI*2, item, appData, [

      ], plugs.primaryPiston.plug)

      plugs.primaryPistonStartSeal = data;
    }
    

    {
      const xfo = new ZeaEngine.Xfo()
      xfo.ori.setFromDirectionAndUpvector(new ZeaEngine.Vec3(0, 1, 0), new ZeaEngine.Vec3(0, 0, 1))
      xfo.tr.set(0.0, -0.114, 0.0)
      const item = asset.resolvePath(["SJ Cilindro MESTRE", "Anel Trava"])
      const data = setupPlugAndSocket(asset, "clipSocket", xfo, 0.007, 0.055, 0.002, Math.PI*2, item, appData, [
        plugs.primaryPiston.socket,
        plugs.primaryPistonStartSeal.socket,
      ], masterCylinderGroup)

      plugs.clipSocket = data;
    }

    plugs.secondaryPistonRamSeal.plug.addConnectableSocket(plugs.secondaryPistonEndSeal.socket)
    plugs.secondaryPistonRamSeal.plug.addConnectableSocket(plugs.primaryPistonEndSeal.socket)
    // plugs.secondaryPistonRamSeal.plug.addConnectableSocket(plugs.primaryPistonStartSeal.socket)

    plugs.secondaryPistonEndSeal.plug.addConnectableSocket(plugs.secondaryPistonRamSeal.socket)
    plugs.secondaryPistonEndSeal.plug.addConnectableSocket(plugs.primaryPistonEndSeal.socket)
    // plugs.secondaryPistonEndSeal.plug.addConnectableSocket(plugs.primaryPistonStartSeal.socket)
    
    plugs.primaryPistonEndSeal.plug.addConnectableSocket(plugs.secondaryPistonRamSeal.socket)
    plugs.primaryPistonEndSeal.plug.addConnectableSocket(plugs.secondaryPistonEndSeal.socket)
    plugs.primaryPistonEndSeal.plug.addConnectableSocket(plugs.primaryPistonStartSeal.socket)

    // plugs.primaryPistonStartSeal.plug.addConnectableSocket(plugs.secondaryPistonEndSeal.socket)
    // plugs.primaryPistonStartSeal.plug.addConnectableSocket(plugs.secondaryPistonRamSeal.socket)
    // plugs.primaryPistonStartSeal.plug.addConnectableSocket(plugs.primaryPistonEndSeal.socket)
    

    let plugsPositions = [
      new ZeaEngine.Vec3(0.0, -0.2, 0.2),
      new ZeaEngine.Vec3(0.0, -0.2, 0.1),
      new ZeaEngine.Vec3(0.0, -0.2, 0.0),
      new ZeaEngine.Vec3(0.0, -0.2, -0.1),
      new ZeaEngine.Vec3(0.0, 0.0, 0.2),
      new ZeaEngine.Vec3(0.0, 0.0, 0.1),
      new ZeaEngine.Vec3(0.0, 0.0, 0.0),
      new ZeaEngine.Vec3(0.0, 0.0, -0.1),
      new ZeaEngine.Vec3(0.0, -0.1, 0.2),
      new ZeaEngine.Vec3(0.0, -0.1, 0.1),
      new ZeaEngine.Vec3(0.0, -0.1, 0.0),
      new ZeaEngine.Vec3(0.0, -0.1, -0.1),
      new ZeaEngine.Vec3(0.0, 0.1, 0.2),
      new ZeaEngine.Vec3(0.0, 0.1, 0.1),
      new ZeaEngine.Vec3(0.0, 0.1, 0.0),
      new ZeaEngine.Vec3(0.0, 0.1, -0.1),
    ]
    const hilightAllPlugs = (duration) => {
      const color = new ZeaEngine.Color(0, 1, 0, 0.25);
      for (let key in plugs) {
        const p = plugs[key].plug
        if (p instanceof PlugItem) {
          p.getParameter("HighlightColor").setValue(color)
          p.getParameter("HighlightFill").setValue(color.a)
          p.getParameter("Highlighted").setValue(true)
        }
      }
      if (duration) {
        setTimeout(()=> {
          for (let key in plugs) {
            const p = plugs[key].plug
            if (p instanceof PlugItem) {
              p.getParameter("Highlighted").setValue(false)
            }
          }
        }, duration)
      }
    }
    // hilightAllPlugs(1000);
    const applyCutaway = (delay) =>{
      cutAwayGroup.getParameter('CutAwayEnabled').setValue(true);  
      const cutDist = asset.getParameter('CutPlaneDist');
      let cutAmount = -0.2;
      cutDist.setValue(cutAmount)
      const timerCallback = () => {
          cutAmount += 0.002;
          cutDist.setValue(cutAmount);
          if (cutAmount < 0.0) {
              timeoutId = setTimeout(timerCallback, 20); // Sample at 50fps.
          }
      };
      setTimeout(timerCallback, delay); // half second delay
    }
    let index = 0;
    let plugCout = 0;
    for (let key in plugs) {
      const p = plugs[key].plug
      const plugXfo = p.getParameter("GlobalXfo").getValue()
      plugXfo.tr = plugsPositions[index];
      plugXfo.tr.y *= 2
      p.getParameter("GlobalXfo").setValue(plugXfo)
      if (p instanceof PlugItem) {
        p.state = PlugMode.UNCONNECTED
        plugs[key].socket.plugged.connect(()=>{
          plugCout--;
          if (plugCout == 0) {
            hilightAllPlugs(1000)
            applyCutaway(500)
          }
        })
        plugCout++;
      }
      index++;
    }

  }
  
}