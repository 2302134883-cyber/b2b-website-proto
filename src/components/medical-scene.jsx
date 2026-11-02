import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Edges, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

const C = {
  white: '#f8f9fb', side: '#e7eaf0', line: '#cbd2dc', ink: '#111827',
  blue: '#a8c8fa', purple: '#d3c6f8', pink: '#f3d4ec', paleBlue: '#e8f0fc', palePurple: '#f1edfd',
};
const gradientMap = new THREE.DataTexture(new Uint8Array([90, 155, 215, 255]), 4, 1, THREE.RedFormat);
gradientMap.minFilter = THREE.NearestFilter;
gradientMap.magFilter = THREE.NearestFilter;
gradientMap.needsUpdate = true;

function Toon({ color }) {
  return <meshToonMaterial color={color} gradientMap={gradientMap} />;
}

function Block({ size = [1, 1, 1], position = [0, 0, 0], rotation = [0, 0, 0], color = C.white, radius = 0.05, outline = false }) {
  return (
    <RoundedBox args={size} position={position} rotation={rotation} radius={radius} smoothness={3} castShadow receiveShadow>
      <Toon color={color} />
      {outline && <Edges color="#aeb7c4" threshold={24} />}
    </RoundedBox>
  );
}

function Cylinder({ args, position = [0, 0, 0], rotation = [0, 0, 0], color = C.white }) {
  return (
    <mesh position={position} rotation={rotation} castShadow receiveShadow>
      <cylinderGeometry args={args} />
      <Toon color={color} />
    </mesh>
  );
}

function Sphere({ args, position = [0, 0, 0], color = C.white }) {
  return (
    <mesh position={position} castShadow receiveShadow>
      <sphereGeometry args={args} />
      <Toon color={color} />
    </mesh>
  );
}

function Warehouse() {
  return (
    <group>
      <Block size={[1.45, 1.05, 1.15]} position={[0, 0.55, 0]} radius={0.07} outline />
      <Block size={[1.58, 0.18, 1.3]} position={[0, 1.14, 0]} color={C.paleBlue} radius={0.05} />
      <Block size={[0.4, 0.65, 0.06]} position={[-0.35, 0.37, 0.59]} color="#ffffff" radius={0.025} />
      <Block size={[0.35, 0.34, 0.07]} position={[0.38, 0.72, 0.6]} color={C.purple} radius={0.035} />
      <Block size={[0.08, 0.24, 0.08]} position={[0.38, 0.72, 0.65]} color="#ffffff" radius={0.01} />
      <Block size={[0.22, 0.08, 0.08]} position={[0.38, 0.72, 0.65]} color="#ffffff" radius={0.01} />
      <Block size={[0.38, 0.38, 0.38]} position={[0.82, 0.2, 0.3]} color={C.pink} radius={0.035} outline />
    </group>
  );
}

function Shield() {
  const shape = React.useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 0.78);
    s.lineTo(0.52, 0.52);
    s.lineTo(0.52, 0.05);
    s.bezierCurveTo(0.52, -0.45, 0.26, -0.75, 0, -0.94);
    s.bezierCurveTo(-0.26, -0.75, -0.52, -0.45, -0.52, 0.05);
    s.lineTo(-0.52, 0.52);
    s.closePath();
    return s;
  }, []);
  return (
    <group position={[0, 1.05, 0]} rotation={[0, -0.28, 0]}>
      <mesh castShadow receiveShadow>
        <extrudeGeometry args={[shape, { depth: 0.2, bevelEnabled: true, bevelSize: 0.055, bevelThickness: 0.055, bevelSegments: 4 }]} />
        <Toon color={C.purple} />
        <Edges color="#a99fc4" threshold={28} />
      </mesh>
      <Block size={[0.11, 0.46, 0.09]} position={[-0.16, -0.05, 0.29]} rotation={[0, 0, -0.72]} color={C.ink} radius={0.025} />
      <Block size={[0.11, 0.76, 0.09]} position={[0.16, 0.06, 0.29]} rotation={[0, 0, 0.68]} color={C.ink} radius={0.025} />
    </group>
  );
}

function Licence() {
  return (
    <group>
      <Block size={[1.0, 1.38, 0.15]} position={[0, 0.76, 0]} radius={0.055} outline />
      {[0, 1, 2].map((i) => (
        <Block key={i} size={[0.58 - i * 0.08, 0.045, 0.035]} position={[-0.05, 1.12 - i * 0.15, 0.095]} color={C.purple} radius={0.01} />
      ))}
      <Cylinder args={[0.14, 0.14, 0.05, 32]} position={[-0.08, 0.48, 0.12]} rotation={[Math.PI / 2, 0, 0]} color={C.pink} />
      <Block size={[0.07, 0.25, 0.04]} position={[-0.16, 0.28, 0.12]} rotation={[0, 0, 0.2]} color={C.purple} radius={0.01} />
      <Block size={[0.07, 0.25, 0.04]} position={[0, 0.28, 0.12]} rotation={[0, 0, -0.2]} color={C.purple} radius={0.01} />
      <group position={[0.57, 0.43, 0.14]}>
        <mesh castShadow>
          <torusGeometry args={[0.23, 0.035, 12, 40]} />
          <Toon color={C.blue} />
        </mesh>
        <Block size={[0.035, 0.18, 0.035]} position={[0, 0.08, 0.02]} color={C.ink} radius={0.008} />
        <Block size={[0.15, 0.035, 0.035]} position={[0.07, 0, 0.02]} color={C.ink} radius={0.008} />
      </group>
    </group>
  );
}

function RegionMap() {
  return (
    <group>
      <Block size={[0.62, 0.07, 1.0]} position={[-0.58, 0.32, 0]} rotation={[0, 0, -0.12]} color={C.paleBlue} radius={0.025} outline />
      <Block size={[0.62, 0.07, 1.0]} position={[0, 0.39, 0]} rotation={[0, 0, 0.14]} color="#ffffff" radius={0.025} outline />
      <Block size={[0.62, 0.07, 1.0]} position={[0.58, 0.32, 0]} rotation={[0, 0, -0.12]} color={C.palePurple} radius={0.025} outline />
      <group position={[0.05, 0.72, 0.05]}>
        <Sphere args={[0.25, 24, 24]} position={[0, 0.43, 0]} color={C.purple} />
        <mesh position={[0, 0.04, 0]} rotation={[Math.PI, 0, 0]} castShadow>
          <coneGeometry args={[0.22, 0.58, 24]} />
          <Toon color={C.purple} />
        </mesh>
        <Sphere args={[0.095, 20, 20]} position={[0, 0.43, 0.2]} color="#ffffff" />
      </group>
    </group>
  );
}

function Hospital() {
  return (
    <group>
      <Block size={[1.5, 1.25, 1.12]} position={[0, 0.65, 0]} radius={0.065} outline />
      <Block size={[1.62, 0.18, 1.25]} position={[0, 1.34, 0]} color={C.paleBlue} radius={0.045} />
      <Block size={[0.52, 0.78, 0.9]} position={[-0.96, 0.42, 0.06]} color={C.side} radius={0.05} outline />
      <Block size={[0.52, 0.78, 0.9]} position={[0.96, 0.42, 0.06]} color={C.side} radius={0.05} outline />
      <Block size={[0.42, 0.4, 0.07]} position={[0, 0.98, 0.59]} color={C.purple} radius={0.04} />
      <Block size={[0.1, 0.29, 0.08]} position={[0, 0.98, 0.64]} color="#ffffff" radius={0.012} />
      <Block size={[0.28, 0.1, 0.08]} position={[0, 0.98, 0.64]} color="#ffffff" radius={0.012} />
      {[-0.45, 0, 0.45].map((x) => (
        <Block key={x} size={[0.18, 0.2, 0.045]} position={[x, 0.48, 0.585]} color={C.blue} radius={0.015} />
      ))}
      <Block size={[0.38, 0.5, 0.06]} position={[0, 0.28, 0.59]} color="#ffffff" radius={0.025} />
      <Block size={[0.5, 0.1, 0.45]} position={[0.8, 0.92, 0.08]} color={C.pink} radius={0.02} />
      <Block size={[0.5, 0.1, 0.45]} position={[0.8, 1.03, 0.08]} color="#ffffff" radius={0.02} />
    </group>
  );
}

function Truck() {
  return (
    <group>
      <Block size={[1.35, 0.95, 0.9]} position={[-0.38, 0.75, 0]} radius={0.07} outline />
      <Block size={[0.75, 0.72, 0.9]} position={[0.7, 0.55, 0]} color={C.purple} radius={0.09} outline />
      <Block size={[0.42, 0.25, 0.05]} position={[0.72, 0.68, 0.47]} color={C.paleBlue} radius={0.025} />
      <Block size={[0.1, 0.4, 0.07]} position={[-0.63, 0.79, 0.48]} rotation={[0, 0, -0.72]} color={C.ink} radius={0.02} />
      <Block size={[0.1, 0.62, 0.07]} position={[-0.35, 0.87, 0.48]} rotation={[0, 0, 0.65]} color={C.ink} radius={0.02} />
      {[-0.72, 0.68].map((x) => (
        <React.Fragment key={x}>
          <Cylinder args={[0.22, 0.22, 0.18, 28]} position={[x, 0.23, 0.48]} rotation={[Math.PI / 2, 0, 0]} color={C.ink} />
          <Cylinder args={[0.22, 0.22, 0.18, 28]} position={[x, 0.23, -0.48]} rotation={[Math.PI / 2, 0, 0]} color={C.ink} />
        </React.Fragment>
      ))}
    </group>
  );
}

const MODELS = [Warehouse, Shield, Licence, RegionMap, Hospital, Truck];
const LABELS = ['经销商下单', '经营范围校验', '证照效期校验', '区域可售校验', '医院准入存证', '放行出单'];
const LABEL_OFFSETS = [[0, 1.85, 0.5], [-0.35, 2.35, 0.35], [0.35, 2.05, 0], [0, 2.05, 0], [0, 2.05, 0], [0, 2.05, 0]];
const POSITIONS = [
  [-4.25, 0, 1.35], [-2.55, 0, 0.1], [-0.7, 0, -1.0],
  [1.1, 0, 0.1], [2.85, 0, 1.1], [4.45, 0, -0.65],
];

function StepModel({ index, active, onSelect, modelRefs }) {
  const ref = useRef();
  const [hovered, setHovered] = useState(false);
  const Model = MODELS[index];
  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.position.y = THREE.MathUtils.damp(ref.current.position.y, active || hovered ? 0.2 : 0, 7, delta);
    const scale = THREE.MathUtils.damp(ref.current.scale.x, active || hovered ? 1.05 : 1, 7, delta);
    ref.current.scale.setScalar(scale);
  });
  return (
    <group position={POSITIONS[index]}>
      <group
        ref={(node) => { ref.current = node; modelRefs.current[index] = node; }}
        onPointerOver={(event) => { event.stopPropagation(); setHovered(true); }}
        onPointerOut={() => setHovered(false)}
        onClick={(event) => { event.stopPropagation(); onSelect(index); }}
      >
        <mesh position={[0, 0.025, 0]} rotation={[-Math.PI / 2, 0, 0]} visible={active || hovered}>
          <ringGeometry args={[0.78, 0.88, 48]} />
          <meshBasicMaterial color="#c4b5f5" transparent opacity={0.48} />
        </mesh>
        <Model />
      </group>
    </group>
  );
}

function RouteDots({ active }) {
  const curve = React.useMemo(() => new THREE.CatmullRomCurve3(POSITIONS.map(([x, , z]) => new THREE.Vector3(x, 0.08, z))), []);
  const points = React.useMemo(() => curve.getPoints(34), [curve]);
  const road = React.useMemo(() => new THREE.TubeGeometry(curve, 80, 0.065, 8, false), [curve]);
  return (
    <group>
      <mesh geometry={road} receiveShadow><Toon color="#e5e0f3" /></mesh>
      {points.map((p, i) => (
        <Sphere key={i} args={[0.04, 10, 10]} position={[p.x, p.y + 0.055, p.z]} color={i / (points.length - 1) <= active / (MODELS.length - 1) ? C.purple : '#f4f1f8'} />
      ))}
    </group>
  );
}

function Tree({ position, scale = 1 }) {
  return (
    <group position={position} scale={scale}>
      <Cylinder args={[0.07, 0.09, 0.5, 12]} position={[0, 0.25, 0]} color="#d7d0c8" />
      <mesh position={[0, 0.68, 0]} castShadow>
        <coneGeometry args={[0.34, 0.82, 20]} />
        <Toon color="#dce8fd" />
      </mesh>
      <mesh position={[0, 0.95, 0]} castShadow>
        <coneGeometry args={[0.25, 0.62, 20]} />
        <Toon color="#e8e0f6" />
      </mesh>
    </group>
  );
}

function CampusDetails() {
  return (
    <group>
      {[[-4.9, 0, -2.7], [-3.1, 0, 2.75], [-0.2, 0, 2.9], [3.9, 0, 2.55], [4.9, 0, -2.6], [0.1, 0, -2.9]].map((position, i) => (
        <Tree key={i} position={position} scale={i % 2 ? 0.82 : 1} />
      ))}
      <group position={[-5.0, 0, 2.35]}>
        <Block size={[0.14, 0.85, 0.14]} position={[-0.42, 0.43, 0]} color={C.side} radius={0.025} />
        <Block size={[0.14, 0.85, 0.14]} position={[0.42, 0.43, 0]} color={C.side} radius={0.025} />
        <Block size={[1.0, 0.16, 0.2]} position={[0, 0.86, 0]} color={C.paleBlue} radius={0.035} />
        <Block size={[0.08, 0.25, 0.05]} position={[0, 0.86, 0.12]} color={C.purple} radius={0.012} />
        <Block size={[0.24, 0.08, 0.05]} position={[0, 0.86, 0.12]} color={C.purple} radius={0.012} />
      </group>
      <Block size={[2.5, 0.25, 0.12]} position={[2.8, 0.13, 2.25]} color={C.side} radius={0.025} />
      <Block size={[0.14, 0.65, 0.14]} position={[5.0, 0.33, -0.2]} color={C.side} radius={0.025} />
      <Block size={[0.14, 0.65, 0.14]} position={[5.0, 0.33, -1.15]} color={C.side} radius={0.025} />
      <Block size={[0.18, 0.14, 1.1]} position={[5.0, 0.7, -0.68]} color={C.palePurple} radius={0.03} />
    </group>
  );
}

/* 标签锚定各自模型的固定局部偏移，旋转与抬升时距离保持不变。 */
function ProjectionUpdater({ modelRefs, hotspotRefs }) {
  const { camera, size } = useThree();
  const point = React.useMemo(() => new THREE.Vector3(), []);
  useFrame(() => {
    for (let index = 0; index < MODELS.length; index += 1) {
      const model = modelRefs.current[index];
      const button = hotspotRefs.current[index];
      if (!model || !button) continue;
      point.set(...LABEL_OFFSETS[index]);
      model.localToWorld(point);
      point.project(camera);
      const x = THREE.MathUtils.clamp((point.x * 0.5 + 0.5) * size.width, 70, size.width - 70);
      const y = THREE.MathUtils.clamp((-point.y * 0.5 + 0.5) * size.height, 24, size.height - 44);
      button.style.left = `${x}px`;
      button.style.top = `${y}px`;
    }
  });
  return null;
}

function SceneContent({ active, onSelect, rotationRef, modelRefs, hotspotRefs }) {
  const world = useRef();
  useFrame((_, delta) => {
    if (world.current) world.current.rotation.y = THREE.MathUtils.damp(world.current.rotation.y, rotationRef.current, 6, delta);
  });
  return (
    <>
      <group ref={world}>
        <RoundedBox args={[11.8, 0.34, 7.4]} position={[0, -0.2, 0]} radius={0.18} smoothness={5} receiveShadow>
          <Toon color="#f4f4f6" />
          <Edges color="#d7dce4" threshold={28} />
        </RoundedBox>
        <RouteDots active={active} />
        <CampusDetails />
        {MODELS.map((_, index) => <StepModel key={index} index={index} active={active === index} onSelect={onSelect} modelRefs={modelRefs} />)}
      </group>
      <ProjectionUpdater modelRefs={modelRefs} hotspotRefs={hotspotRefs} />
    </>
  );
}

function MedicalScene() {
  const [active, setActive] = useState(0);
  const rotationRef = useRef(-0.12);
  const modelRefs = useRef([]);
  const hotspotRefs = useRef([]);
  const drag = useRef({ down: false, x: 0, start: 0 });

  useEffect(() => {
    const host = document.getElementById('md3dScene');
    if (!host) return undefined;
    const onStep = (event) => setActive(event.detail.index);
    host.addEventListener('md3d:step', onStep);
    return () => host.removeEventListener('md3d:step', onStep);
  }, []);

  function onSelect(index) {
    document.getElementById('md3dScene')?.dispatchEvent(new CustomEvent('md3d:select', { detail: { index } }));
  }
  function pointerDown(event) {
    if (event.target.closest('.md3d-hotspot')) return;
    drag.current = { down: true, x: event.clientX, start: rotationRef.current };
    event.currentTarget.setPointerCapture(event.pointerId);
  }
  function pointerMove(event) {
    if (!drag.current.down) return;
    const next = drag.current.start + (event.clientX - drag.current.x) * 0.004;
    rotationRef.current = THREE.MathUtils.clamp(next, -0.65, 0.65);
  }
  function pointerUp(event) {
    drag.current.down = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  }

  return (
    <div className="md3d-live" onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={pointerUp} onPointerCancel={pointerUp}>
      <Canvas
        orthographic
        shadows
        flat
        dpr={[1, 2]}
        camera={{ position: [8, 7, 10], zoom: 46, near: 0.1, far: 100 }}
        onCreated={({ camera }) => camera.lookAt(0, 0.3, 0)}
      >
        <ambientLight intensity={0.85} />
        <hemisphereLight args={['#ffffff', '#dfe4ec', 0.65]} />
        <directionalLight
          position={[-4, 9, 7]} intensity={1.35} castShadow
          shadow-mapSize-width={1024} shadow-mapSize-height={1024}
          shadow-camera-left={-9} shadow-camera-right={9}
          shadow-camera-top={9} shadow-camera-bottom={-9}
          shadow-bias={-0.0004}
        />
        <SceneContent active={active} onSelect={onSelect} rotationRef={rotationRef} modelRefs={modelRefs} hotspotRefs={hotspotRefs} />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.39, 0]} receiveShadow>
          <planeGeometry args={[40, 40]} />
          <shadowMaterial opacity={0.09} />
        </mesh>
      </Canvas>
      <div className="md3d-hotspots">
        {MODELS.map((_, index) => (
          <button
            key={index}
            ref={(node) => { hotspotRefs.current[index] = node; }}
            type="button"
            className={`md3d-step md3d-hotspot ${active === index ? 'is-active' : ''}`}
            data-md3d-step={index}
            onClick={() => onSelect(index)}
          >
            <span className="md3d-hotspot-num">{String(index + 1).padStart(2, '0')}</span>
            <span>{LABELS[index]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

const container = document.getElementById('md3dCanvas');
if (container) createRoot(container).render(<MedicalScene />);
