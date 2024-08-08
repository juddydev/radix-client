import * as THREE from "three"
import { Suspense } from "react"
import { Canvas, useThree } from "@react-three/fiber"
import { OrbitControls, useGLTF, useTexture } from "@react-three/drei"
import { useLocation } from "@remix-run/react"
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader.js"

interface MainModelProps {
  upperMapTextureURL: string
  upperNormalTextureURL: string
  upperRoughnessTextureURL: string
  soleMapTextureURL: string
  checkedValue: boolean
}

type GLTFResult = GLTF & {
  nodes: {
    [key: string]: THREE.Mesh
  }
}

function Model({ ...props }) {
  const { viewport } = useThree()
  const location = useLocation()
  const data = location.state?.data
  const modelNodes = data.media.nodes.filter((m: { __typename: string }) => {
    return m.__typename === "Model3d"
  })

  const modelUrl = modelNodes[0].sources[0].url

  const textureNodes = data.media.nodes.filter(
    (m: { __typename: string; alt: string }) => {
      return (m.__typename === "MediaImage" && m.alt === "") || null
    },
  )
  const gltf = useGLTF(modelUrl)
  const gltfResult = gltf as unknown as GLTFResult
  const { nodes } = gltfResult

  const upperTextures = useTexture({
    map: props.upperMapTextureURL,
    normalMap: props.upperNormalTextureURL,
    roughnessMap: props.upperRoughnessTextureURL,
  })

  const bolangdiOutsoleTextures = useTexture({
    map: props.soleMapTextureURL,
    normalMap: textureNodes[25].image.url,
    roughnessMap: textureNodes[13].image.url,
  })

  const upperMat = new THREE.MeshStandardMaterial({
    map: upperTextures.map,
    normalMap: upperTextures.normalMap,
    roughnessMap: upperTextures.roughnessMap,
  })

  const bolangdiOutSoleMat = new THREE.MeshStandardMaterial({
    map: bolangdiOutsoleTextures.map,
    normalMap: bolangdiOutsoleTextures.normalMap,
    roughnessMap: bolangdiOutsoleTextures.roughnessMap,
  })
  ;(upperTextures.map as THREE.Texture).flipY = false
  ;(upperTextures.normalMap as THREE.Texture).flipY = false
  ;(upperTextures.roughnessMap as THREE.Texture).flipY = false
  ;(bolangdiOutsoleTextures.map as THREE.Texture).flipY = false
  ;(bolangdiOutsoleTextures.normalMap as THREE.Texture).flipY = false
  ;(bolangdiOutsoleTextures.roughnessMap as THREE.Texture).flipY = false

  return (
    <group dispose={null}>
      <group
        rotation={[Math.PI / 2, 0, 0]}
        scale={window.innerWidth > 1024 ? 0.01 : viewport.width / 35}
      >
        {!props.checkedValue ? (
          <>
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.main_sole.geometry}
              material={bolangdiOutSoleMat}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.main_heel.geometry}
              material={bolangdiOutSoleMat}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.main_string.geometry}
              material={bolangdiOutSoleMat}
            />
          </>
        ) : (
          <></>
        )}
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.main_quarter.geometry}
          material={upperMat}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.main_upper.geometry}
          material={upperMat}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.main_upper_line.geometry}
          material={upperMat}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.main_eyelet.geometry}
          material={upperMat}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.main_heelstrip.geometry}
          material={upperMat}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.main_insole.geometry}
          material={upperMat}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.main_lace.geometry}
          material={upperMat}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.main_Lining.geometry}
          material={upperMat}
        />
      </group>
    </group>
  )
}

export default function ModelViewer({
  upperMapTextureURL,
  upperNormalTextureURL,
  upperRoughnessTextureURL,
  soleMapTextureURL,
  checkedValue,
}: MainModelProps) {
  return (
    <div className="h-[900px] w-full lg:h-full">
      {/* <div className='w-full lg:w-[70%] h-[750px]'> */}
      <Canvas
        shadows
        camera={{ position: [0.8, 0, 0.1], fov: 25 }}
        className=""
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <directionalLight color={0xffffff} intensity={1.5} castShadow />
        <directionalLight
          color={0xffffff}
          intensity={1.5}
          castShadow
          position={[10, -25, 10]}
        />
        <Suspense fallback={null}>
          <Model
            upperMapTextureURL={upperMapTextureURL}
            upperNormalTextureURL={upperNormalTextureURL}
            upperRoughnessTextureURL={upperRoughnessTextureURL}
            soleMapTextureURL={soleMapTextureURL}
            checkedValue={checkedValue}
          />
        </Suspense>
        <OrbitControls />
      </Canvas>
    </div>
  )
}
