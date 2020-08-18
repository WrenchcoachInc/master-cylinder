
function download(json, filename){
  function downloadURI(uri, name) {
    let link = document.createElement("a");
    link.download = name;
    link.href = uri;
    link.style.display = "none";

    document.body.appendChild(link);
    if (typeof MouseEvent !== "undefined") {
        link.dispatchEvent(new MouseEvent("click"));
    } else {
        link.click();
    }
    document.body.removeChild(link);
  }

  let blob = new Blob([json], {type: "application/json"});
  let url = window.URL.createObjectURL(blob);
  downloadURI(url, filename);
  window.URL.revokeObjectURL(url);
}


function servo_mestre(scene, renderer, appData) {
  scene.setupGrid(1, 10);
  // return;

  const urlParams = new URLSearchParams(window.location.search);
  const language = urlParams.get('language');
  if (language) {
    ZeaEngine.labelManager.setLanguage(language)
  }

  const position = new ZeaEngine.Vec3({"x":0.86471,"y":0.87384,"z":0.18464})
  const target = new ZeaEngine.Vec3({"x":0,"y":0.00913,"z":-0.03154})
  renderer.getViewport().getCamera().setPositionAndTarget(position, target);
  scene.getSettings().getParameter("BackgroundColor").setValue(new ZeaEngine.Color(0.8, 0.8, 0.8))

  const envMap = new ZeaEngine.EnvMap("HDR_029_Sky_Cloudy_Ref");
  envMap.getParameter('FilePath').setFilepath("HDREnvironments/HDR_029_Sky_Cloudy_Ref.vlenv");
  scene.setEnvMap(envMap);
  renderer.displayEnvironment = false;

  const cadPass = renderer.findPass(ZeaCad.GLCADPass)
  cadPass.setShaderPreprocessorValue('#define ENABLE_CUTAWAYS');
  cadPass.setShaderPreprocessorValue('#define ENABLE_PBR');
  
  //////////////////////////
  // Asset
  const asset = loadAsset(scene);

  asset.loaded.connect(() => {
    renderer.frameAll();
    // const xfo = renderer.getViewport().getCamera().getGlobalXfo()
    // const target = renderer.getViewport().getCamera().getTargetPostion()
    // console.log(xfo.toString(), target.toString())
  });

  ////////////////////////////////////////////////////////////////
  // States
  asset.loaded.connect(() => {
    // Load and add point cloud to scene
    switch (appData.stage) {
    case 'learning':{
      setupStates(scene, asset, renderer, appData);
      break;
      }
    case 'identification':{
      setupIdentification(scene, asset, renderer, appData);
      break;
      }
    case 'simulation':{
      setupSimulator(scene, asset, renderer, appData);
      break;
      }
    case 'assembly':{
      setupAssembly(scene, asset, renderer, appData);
      break;
      }
    }
  });

  if (document.location.hostname == "localhost") {
    let currSel;
    const togglePreProc = (name) => {
      const val = cadPass.getShaderPreprocessorValue(name);
      if(!val)
        cadPass.setShaderPreprocessorValue(name);
      else
        cadPass.clearShaderPreprocessorValue(name);
    }
    renderer.getViewport().keyPressed.connect((key, event)=>{
      switch (key) {
      case 'a':
        togglePreProc('#define DEBUG_BODYID');
        break;
      case 's':
        if(event.ctrlKey ){
          const j = scene.toJSON();
          console.log(j)
          event.preventDefault()
        } else {
          togglePreProc('#define DEBUG_SURFACEID');
        }
        break;
      case 'd':
        togglePreProc('#define DEBUG_SURFACETYPE');
        break;
      case 't':
        if(event.shiftKey) {
          const p = cadPass.getParameter('DebugTrimTex');
          p.setValue(!p.getValue());
        }
        else
          togglePreProc('#define DEBUG_TRIMTEXELS');
        break;
      case'[': {
        currSel.setSelected(false);
        currSel = currSel.getOwner();
        currSel.traverse( item => item.setSelected(true))
        console.log(currSel.getPath());
        break;
      }
      case'h': {
        const vis = currSel.getVisible();
        currSel.traverse( item => item.setVisible(!vis));
        break;
      }
      case 'w':
        cadPass.displayWireframes = !cadPass.displayWireframes;
        renderer.requestRedraw();
        break;
      case 'e':
        cadPass.displayEdges = !cadPass.displayEdges;
        renderer.requestRedraw();
        break; 
      case 'n':
        cadPass.displayNormals = !cadPass.displayNormals;
        console.log("displayNormals:", cadPass.displayNormals)
        renderer.requestRedraw();
        break; 
      case 'p':
        const j = scene.toJSON();
        console.log(j)
        download(j, "file.scene")
        break;
      case 'v':
        if(event.shiftKey) {
          if (!renderer.getVRViewport())
            console.warn("VR not supported on your system")
          else
            renderer.getVRViewport().togglePresenting()
        }
        break;
      }
      
    });
    renderer.getViewport().mouseDownOnGeom.connect((event)=>{
      const intersectionData = event.intersectionData;
      const geomItem = intersectionData.geomItem;
      if(!event.shiftKey && !event.altKey){
        if(geomItem.getSelected()) {
          geomItem.traverse( item => item.setSelected(false));
          if(geomItem == currSel)
            currSel = null;
        }
        else {
          if(currSel)
            currSel.traverse( item => item.setSelected(false), true);
          currSel = geomItem;
          currSel.traverse( item => item.setSelected(true), true);
          console.log(currSel.getPath());
        }
      }
    });
  }
};

window.vlmain = function(domElement, resources) {

  const scene = new ZeaEngine.Scene(resources);

  const renderer = new ZeaEngine.GLRenderer(domElement, {enableTextures:false});

  const cadPass = new ZeaCad.GLCADPass()
  cadPass.setShaderPreprocessorValue('#define ENABLE_CUTAWAYS');
  // cadPass.setShaderPreprocessorValue('#define ENABLE_PBR');
  renderer.addPass(cadPass, ZeaEngine.PassType.OPAQUE)
  renderer.setScene(scene);
  renderer.resumeDrawing();

  const urlParams = new URLSearchParams(window.location.search);
  const stage = urlParams.get('stage');
  servo_mestre(scene, renderer, {
    UX: ZeaUx,
    stage
  });

}