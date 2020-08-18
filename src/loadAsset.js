import { Vec3, Quat, Xfo, EulerAngles, Group, Material, Color } from '../libs/zea-engine/dist/index.esm.js'
import { GLCADPass, CADAsset } from '../libs/zea-cad/dist/index.rawimport.js'

function loadAsset() {
  const asset = new CADAsset()
  const xfo = new Xfo()
  xfo.ori.setFromEulerAngles(new EulerAngles(0.0, Math.PI * -0.5, 0, 'ZXY'))
  // xfo.sc.set(0.0254 * 0.5);
  // const materialLibrary = asset.getMaterialLibrary();
  // materialLibrary.setMaterialTypeMapping({
  //     '*': 'SimpleSurfaceShader'
  // });
  asset.getParameter('GlobalXfo').setValue(xfo)
  asset.getParameter('DataFilePath').setValue('data/servo_mestre.zcad')

  // return asset

  // https://www.quadratec.com/p/mopar/brake-master-cylinder-booster-jk-dana-60-axle-P5160050
  // https://righttorisesuperpac.org/symptoms-of-a-bad-brake-booster/

  const blackPlasticGroup = new Group('blackPlasticGroup')
  {
    const material = new Material('blackPlastic')
    material.modifyParams(
      {
        BaseColor: new Color(0.01, 0.01, 0.01),
        Metallic: 0.0,
        Roughness: 0.45,
        Reflectance: 0.03,
      },
      'GLDrawCADSurfaceShader'
    )
    blackPlasticGroup.getParameter('Material').setValue(material)
    asset.addChild(blackPlasticGroup)
  }

  const blackRubberGroup = new Group('blackRubberGroup')
  {
    const material = new Material('blackRubber')
    material.modifyParams(
      {
        BaseColor: new Color(0.01, 0.01, 0.01),
        Metallic: 0.0,
        Roughness: 0.85,
        Reflectance: 0.01,
      },
      'GLDrawCADSurfaceShader'
    )
    blackRubberGroup.getParameter('Material').setValue(material)
    asset.addChild(blackRubberGroup)
  }

  const whitePlasticGroup = new Group('whitePlasticGroup')
  {
    const material = new Material('whitePlastic')
    material.modifyParams(
      {
        BaseColor: new Color(0.98, 0.98, 0.88),
        Metallic: 0.0,
        Roughness: 0.25,
        Reflectance: 0.03,
      },
      'GLDrawCADSurfaceShader'
    )
    whitePlasticGroup.getParameter('Material').setValue(material)
    asset.addChild(whitePlasticGroup)
  }

  const yellowPlasticGroup = new Group('yellowPlasticGroup')
  {
    const material = new Material('yellowPlastic')
    material.modifyParams(
      {
        BaseColor: new Color('#F0E68C'),
        Metallic: 0.0,
        Roughness: 0.85,
        Reflectance: 0.0,
      },
      'GLDrawCADSurfaceShader'
    )
    yellowPlasticGroup.getParameter('Material').setValue(material)
    asset.addChild(yellowPlasticGroup)
  }

  const shinyMetalGroup = new Group('shinyMetalGroup')
  {
    const material = new Material('shinyMetal')
    material.modifyParams(
      {
        BaseColor: new Color(0.65, 0.65, 0.65),
        Metallic: 0.75,
        Roughness: 0.25,
        Reflectance: 0.85,
      },
      'GLDrawCADSurfaceShader'
    )
    shinyMetalGroup.getParameter('Material').setValue(material)
    asset.addChild(shinyMetalGroup)
  }

  const darkGreyMetalGroup = new Group('darkGreyMetalGroup')
  {
    const material = new Material('darkGreyMetal')
    material.modifyParams(
      {
        BaseColor: new Color(0.45, 0.45, 0.45),
        Metallic: 0.65,
        Roughness: 0.75,
        Reflectance: 0.7,
      },
      'GLDrawCADSurfaceShader'
    )
    darkGreyMetalGroup.getParameter('Material').setValue(material)
    asset.addChild(darkGreyMetalGroup)
  }

  const blackMetalGroup = new Group('blackMetalGroup')
  {
    const material = new Material('blackMetal')
    material.modifyParams(
      {
        BaseColor: new Color(0.0, 0.0, 0.0),
        Metallic: 0.65,
        Roughness: 0.35,
        Reflectance: 0.7,
      },
      'GLDrawCADSurfaceShader'
    )
    blackMetalGroup.getParameter('Material').setValue(material)
    asset.addChild(blackMetalGroup)
  }

  // asset.addEventListener('loaded', () => {
  asset.on('loaded', () => {
    // asset.traverse((item, depth)=>{
    //   console.log(item.getPath())
    // })

    blackPlasticGroup.resolveItems([
      ['.', 'SJ Cilindro MESTRE.1', 'Part1.13'],
      ['.', 'tubo_vacuo'],
    ])

    blackRubberGroup.resolveItems([
      ['.', 'SJ Cilindro MESTRE.1', 'gaxeta'],
      ['.', 'SJ Cilindro MESTRE.1', 'secundaria'],
      ['.', 'SJ Cilindro MESTRE.1', 'secundaria.1'],
      ['.', 'SJ Cilindro MESTRE.1', 'primario'], // Rubber seals to top reservoir
      ['.', 'SJ Cilindro MESTRE.1', 'secundario'], // Rubber seals to top reservoir
      ['.', 'SJ Cilindro MESTRE.1', 'anel_borracha'],
      ['.', 'filtro_ar'],
      ['.', 'SJ Cilindro MESTRE.1', 'Anel Trava'], // Booster seal
      ['.', 'bucha_vacuo'], // Booster seal
    ])

    whitePlasticGroup.resolveItems([['.', 'SJ Cilindro MESTRE.1', 'tanque_fluido.1']])

    yellowPlasticGroup.resolveItems([
      ['.', 'SJ Cilindro MESTRE.1', '1.1'],
      ['.', 'SJ Cilindro MESTRE.1', '1.2'],
      ['.', 'SJ Cilindro MESTRE.1', '1.3'],
      ['.', 'SJ Cilindro MESTRE.1', 'bucha_freio'],
    ])

    shinyMetalGroup.resolveItems([
      ['.', 'mola12.1'], //  Big spring
      ['.', 'SJ Cilindro MESTRE.1', 'mola2.1'], //  Big spring
      ['.', 'SJ Cilindro MESTRE.1', 'mola1.1'],
      ['.', 'disco_dinamico'], // Booster ram.
      ['.', 'Pedal_de freio.1'], // Brake pedal

      ['.', 'paraf_m6'],
      ['.', 'SJ Cilindro MESTRE.1', 'porca_m6.1'],
      ['.', 'Part1.1'],
      ['.', 'SJ Cilindro MESTRE.1', 'porca_m6'],
      ['.', 'mola11.1'],
    ])

    darkGreyMetalGroup.resolveItems([
      ['.', 'SJ Cilindro MESTRE.1', 'cilindro_mestre.1'],
      ['.', 'prato.1'],
      ['.', 'Part1.8'],
      ['.', 'Symmetry of Part1.8.1'],
      ['.', 'Symmetry of Part1.8.2'],
      ['.', 'Symmetry of Symmetry of Part1.8.1.1'],
      ['.', 'SJ Cilindro MESTRE.1', 'cilind'],
      ['.', 'SJ Cilindro MESTRE.1', 'Cilindro2'],
      ['.', 'haste_acionamento'],
      ['.', 'haste_vacuo'],
      ['.', 'SJ Cilindro MESTRE.1', 'Vedante'],
      ['.', 'SJ Cilindro MESTRE.1', 'bucha_guia'],
    ])

    blackMetalGroup.resolveItems([
      ['.', 'bacia_1.1'],
      ['.', 'bacia_2.1'],
    ])
  })

  return asset
}

export default loadAsset
