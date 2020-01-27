

function loadAsset(scene) {

  const asset = new ZeaCad.CADAsset();
  const xfo = new ZeaEngine.Xfo();
  xfo.ori.setFromEulerAngles(new ZeaEngine.EulerAngles(0.0, Math.PI * -0.5,0, 'ZXY'));
  // xfo.sc.set(0.0254 * 0.5);
  // const materialLibrary = asset.getMaterialLibrary();
  // materialLibrary.setMaterialTypeMapping({
  //     '*': 'SimpleSurfaceShader'
  // });
  asset.setLocalXfo(xfo);
  asset.getParameter('DataFilePath').setFilepath("data/servo_mestre.zcad");
  
  // scene.root.addChild(asset);
  // return asset;
  
  // https://www.quadratec.com/p/mopar/brake-master-cylinder-booster-jk-dana-60-axle-P5160050
  // https://righttorisesuperpac.org/symptoms-of-a-bad-brake-booster/

  const blackPlasticGroup = new ZeaEngine.Group('blackPlasticGroup');
  {
    const material = new ZeaEngine.Material('blackPlastic');
    material.modifyParams({
      BaseColor: new ZeaEngine.Color(0.01, 0.01, .01),
      Metallic: 0.0,
      Roughness: 0.45,
      Reflectance: 0.03
    }, "GLDrawCADSurfaceShader")
    blackPlasticGroup.getParameter('Material').setValue(material);  
    asset.addChild(blackPlasticGroup);
  }


  const blackRubberGroup = new ZeaEngine.Group('blackRubberGroup');
  {
    const material = new ZeaEngine.Material('blackRubber');
    material.modifyParams({
      BaseColor: new ZeaEngine.Color(0.01, 0.01, .01),
      Metallic: 0.0,
      Roughness: 0.85,
      Reflectance: 0.01
    }, "GLDrawCADSurfaceShader")
    blackRubberGroup.getParameter('Material').setValue(material);  
    asset.addChild(blackRubberGroup);
  }

  const whitePlasticGroup = new ZeaEngine.Group('whitePlasticGroup');
  {
    const material = new ZeaEngine.Material('whitePlastic');
    material.modifyParams({
      BaseColor: new ZeaEngine.Color(0.98, 0.98, .88),
      Metallic: 0.0,
      Roughness: 0.25,
      Reflectance: 0.03
    }, "GLDrawCADSurfaceShader")
    whitePlasticGroup.getParameter('Material').setValue(material);  
    asset.addChild(whitePlasticGroup);
  }

  const yellowPlasticGroup = new ZeaEngine.Group('yellowPlasticGroup');
  {
    const material = new ZeaEngine.Material('yellowPlastic');
    material.modifyParams({
      BaseColor: new ZeaEngine.Color('#F0E68C'),
      Metallic: 0.0,
      Roughness: 0.85,
      Reflectance: 0.0
    }, "GLDrawCADSurfaceShader")
    yellowPlasticGroup.getParameter('Material').setValue(material);  
    asset.addChild(yellowPlasticGroup);
  }


  const shinyMetalGroup = new ZeaEngine.Group('shinyMetalGroup');
  {
    const material = new ZeaEngine.Material('shinyMetal');
    material.modifyParams({
      BaseColor: new ZeaEngine.Color(0.65, 0.65, .65),
      Metallic: 0.75,
      Roughness: 0.25,
      Reflectance: 0.85
    }, "GLDrawCADSurfaceShader")
    shinyMetalGroup.getParameter('Material').setValue(material);  
    asset.addChild(shinyMetalGroup);
  }


  const darkGreyMetalGroup = new ZeaEngine.Group('darkGreyMetalGroup');
  {
    const material = new ZeaEngine.Material('darkGreyMetal');
    material.modifyParams({
      BaseColor: new ZeaEngine.Color(0.45, 0.45, .45),
      Metallic: 0.65,
      Roughness: 0.75,
      Reflectance: 0.7
    }, "GLDrawCADSurfaceShader")
    darkGreyMetalGroup.getParameter('Material').setValue(material);  
    asset.addChild(darkGreyMetalGroup);
  }


  const blackMetalGroup = new ZeaEngine.Group('blackMetalGroup');
  {
    const material = new ZeaEngine.Material('blackMetal');
    material.modifyParams({
      BaseColor: new ZeaEngine.Color(0.0, 0.0, .0),
      Metallic: 0.65,
      Roughness: 0.35,
      Reflectance: 0.7
    }, "GLDrawCADSurfaceShader")
    blackMetalGroup.getParameter('Material').setValue(material);  
    asset.addChild(blackMetalGroup);
  }

  asset.loaded.connect(() => {
    // asset.traverse((item, depth)=>{
    //   console.log(item.getPath())
    // })
    
    whitePlasticGroup.resolveItems([
      [".", "SJ Cilindro MESTRE", "tanque_fluido"]
    ]);

    yellowPlasticGroup.resolveItems([
      [".", "SJ Cilindro MESTRE", "1.1"],
      [".", "SJ Cilindro MESTRE", "1.2"],
      [".", "SJ Cilindro MESTRE", "1.3"],
      [".", "SJ Cilindro MESTRE", "bucha_freio"]
    ]);
      
    blackPlasticGroup.resolveItems([
      [".", "SJ Cilindro MESTRE", "tampa_tanque"],
      [".", "tubo_vacuo"]
    ]);

    blackRubberGroup.resolveItems([
      [".", "SJ Cilindro MESTRE", "gaxeta"],
      [".", "SJ Cilindro MESTRE", "secundaria"],
      [".", "SJ Cilindro MESTRE", "secundaria.1"],
      [".", "SJ Cilindro MESTRE", "Bucha_tanque"],// Rubber seals to top reservoir
      [".", "SJ Cilindro MESTRE", "secundario"],// Rubber seals to top reservoir
      [".", "SJ Cilindro MESTRE", "anel_borracha"],
      [".", "filtro_ar"],
      [".", "SJ Cilindro MESTRE", "Anel Trava"], // Booster seal
      [".", "bucha_vacuo"], // Booster seal
    ]);
    
      
    shinyMetalGroup.resolveItems([
      [".", "mola12"],//  Big spring
      [".", "SJ Cilindro MESTRE", "mola2"],//  Big spring
      [".", "SJ Cilindro MESTRE", "mola1"],
      [".", "disco_dinamico"], // Booster ram.
      [".", "Pedal_de freio"], // Brake pedal
      
      [".", "paraf_m6"],
      [".", "SJ Cilindro MESTRE", "porca_m6.1"],
      [".", "Part1.1"],
      [".", "SJ Cilindro MESTRE", "porca_m6",],
      [".", "mola11",],
    ]);


    darkGreyMetalGroup.resolveItems([
      [".", "SJ Cilindro MESTRE", "cilindro_mestre"],
      [".", "prato"],
      [".", "Part1"],
      [".", "Symmetry of Part1"],
      [".", "Symmetry of Part1.8.2"],
      [".", "Symmetry of Symmetry of Part1"],
      [".", "SJ Cilindro MESTRE", "cilind"],
      [".", "SJ Cilindro MESTRE", "Cilindro2"],
      [".", "haste_acionamento"],
      [".", "haste_vacuo"],
      [".", "SJ Cilindro MESTRE", "Vedante"],
      [".", "SJ Cilindro MESTRE", "bucha_guia"]
    ]);
    
    
    blackMetalGroup.resolveItems([
      [".", "bacia_1"],
      [".", "bacia_2"]
    ]);

  });
  scene.root.addChild(asset);
  return asset;
}