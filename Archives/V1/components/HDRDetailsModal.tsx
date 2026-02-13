import React, { useState, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text, Float, Stars, Environment, OrthographicCamera } from "@react-three/drei";
import * as THREE from "three";
import { ArrowRight, ArrowLeft, X, Sun, Cpu, FileDigit, Aperture, Monitor, ScanLine, Activity, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const TOTAL_STAGES = 6;
const GRID_SIZE = 14;
const SPACING = 0.5;
const BOARD_SIZE = GRID_SIZE * SPACING + 1;

const STAGE_INFO = [
  {
    title: "1. Light & Bayer Filter",
    description: "Light photons pass through the camera lens and strike the sensor's Bayer Color Filter Array (CFA). Each pixel captures only Red, Green, or Blue light intensity.",
    icon: <Sun className="w-6 h-6 text-yellow-400" />,
    histogramLabel: "SENSOR NOISE",
  },
  {
    title: "2. RAW & Demosaicing",
    description: "The Image Processor reads the voltage from the pixels. The 'Demosaicing' algorithm interpolates the mosaic pattern into 3 distinct RGB layers for every pixel.",
    icon: <Cpu className="w-6 h-6 text-blue-400" />,
    histogramLabel: "RAW DATA (LINEAR)",
  },
  {
    title: "3. Linear Space (Gamma 1.0)",
    description: "The raw data is 'Linear'. Brightness correlates directly to photon count. It looks very dark to the human eye because our vision is logarithmic, not linear.",
    icon: <FileDigit className="w-6 h-6 text-green-400" />,
    histogramLabel: "LINEAR RESPONSE",
  },
  {
    title: "4. Logarithmic Encoding",
    description: "To fit 14-16 stops of dynamic range into a file, a 'Log' curve lifts the shadows and flattens the highlights. The image looks washed out but retains maximum detail.",
    icon: <Aperture className="w-6 h-6 text-purple-400" />,
    histogramLabel: "LOG PROFILE",
  },
  {
    title: "5. HDR Color Grading",
    description: "A Tone Map and Color Matrix (LUT) expand the Log data into the Rec.2020 color space. This restores contrast and saturation, producing a 10-bit HDR image.",
    icon: <Monitor className="w-6 h-6 text-orange-400" />,
    histogramLabel: "HDR (REC.2020)",
  },
  {
    title: "6. SDR Tone Mapping",
    description: "For standard displays, the 10-bit HDR signal is compressed (tone-mapped) down to the 8-bit sRGB space. Peak brightness is clipped, and color range is reduced.",
    icon: <ScanLine className="w-6 h-6 text-gray-400" />,
    histogramLabel: "SDR (sRGB)",
  },
];

// 3D Components
function CameraLens({ active }: { active: boolean }) {
  const meshRef = useRef<THREE.Group>(null!);

  useFrame((_state, delta) => {
    const targetY = active ? 8 : 15;
    const targetScale = active ? 1 : 0;

    meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, delta * 2);
    const scale = THREE.MathUtils.lerp(meshRef.current.scale.x, targetScale, delta * 2);
    meshRef.current.scale.setScalar(scale);
  });

  return (
    <group ref={meshRef} position={[0, 8, 0]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[5, 5, 1, 64, 1, true]} />
        <meshStandardMaterial color="#111" metalness={0.8} roughness={0.2} side={THREE.DoubleSide} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.4]}>
        <cylinderGeometry args={[5.2, 5.2, 0.2, 64]} />
        <meshStandardMaterial color="#333" metalness={0.5} roughness={0.5} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[4.8, 4.8, 0.2, 64]} />
        <meshPhysicalMaterial 
          thickness={2}
          roughness={0}
          clearcoat={1}
          clearcoatRoughness={0}
          transmission={1}
          ior={1.5}
          color="#ccefff"
          transparent
          opacity={0.6}
        />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.1]}>
        <cylinderGeometry args={[4.5, 2, 0.1, 8]} />
        <meshStandardMaterial color="#000" />
      </mesh>
    </group>
  );
}

function VolumetricLight({ active }: { active: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame((_state, delta) => {
    const opacity = active ? 0.2 + Math.sin(_state.clock.elapsedTime * 3) * 0.05 : 0;
    const material = meshRef.current.material as THREE.MeshBasicMaterial;
    const currentOpacity = material.opacity;
    material.opacity = THREE.MathUtils.lerp(currentOpacity, opacity, delta * 5);
    meshRef.current.visible = material.opacity > 0.01;
  });

  return (
    <mesh ref={meshRef} position={[0, 4, 0]}>
      <cylinderGeometry args={[2, 6, 8, 32, 1, true]} />
      <meshBasicMaterial
        color="#ccffff"
        transparent
        opacity={0}
        side={THREE.DoubleSide}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

function SensorBase() {
  return (
    <group position={[0, -0.6, 0]}>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[BOARD_SIZE + 1, 0.5, BOARD_SIZE + 1]} />
        <meshStandardMaterial color="#0a2a1a" roughness={0.3} metalness={0.5} />
      </mesh>
      <mesh position={[BOARD_SIZE / 2 + 0.2, 0.26, 0]}>
        <boxGeometry args={[0.5, 0.1, BOARD_SIZE]} />
        <meshStandardMaterial color="#ffd700" metalness={1} roughness={0.1} />
      </mesh>
      <mesh position={[-BOARD_SIZE / 2 - 0.2, 0.26, 0]}>
        <boxGeometry args={[0.5, 0.1, BOARD_SIZE]} />
        <meshStandardMaterial color="#ffd700" metalness={1} roughness={0.1} />
      </mesh>
    </group>
  );
}

const useImagePattern = (size: number) => {
  return useMemo(() => {
    const colors = [];
    const heights = [];
    for (let i = 0; i < size * size; i++) {
      const x = i % size;
      const y = Math.floor(i / size);
      const cx = size / 2;
      const cy = size / 2;
      const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2) / (size / 1.5);

      const r = 0.8 - dist * 0.5;
      const g = 0.2 + (x / size) * 0.5;
      const b = 0.3 + (y / size) * 0.6;

      colors.push(new THREE.Color(Math.max(0, r), Math.max(0, g), Math.max(0, b)));
      heights.push(0.3 + Math.max(0, 1 - dist) * 2.0);
    }
    return { colors, heights };
  }, [size]);
};

function SensorPixels({ stage }: { stage: number }) {
  const meshRefR = useRef<THREE.InstancedMesh>(null!);
  const meshRefG = useRef<THREE.InstancedMesh>(null!);
  const meshRefB = useRef<THREE.InstancedMesh>(null!);

  const { colors, heights } = useImagePattern(GRID_SIZE);
  const tempObject = new THREE.Object3D();

  const currentColors = useMemo(() => {
    return new Array(GRID_SIZE * GRID_SIZE).fill(0).map(() => new THREE.Color(0, 0, 0));
  }, []);

  const visualState = useRef({
    layerSep: 0,
    globalHeight: 0.1,
    brightness: 0.0,
    saturation: 0.0,
  });

  useFrame((_state, delta) => {
    let targetLayerSep = 0;
    let targetSaturation = 0;
    let targetBrightness = 1.0;
    let targetHeightMult = 0.2;

    switch (stage) {
      case 0:
        targetHeightMult = 0.1;
        targetBrightness = 0.2;
        targetLayerSep = 0;
        break;
      case 1:
        targetLayerSep = 2.5;
        targetHeightMult = 0.6;
        targetBrightness = 0.8;
        break;
      case 2:
        targetLayerSep = 0;
        targetSaturation = 0.9;
        targetBrightness = 0.4;
        targetHeightMult = 0.6;
        break;
      case 3:
        targetLayerSep = 0;
        targetSaturation = 0.3;
        targetBrightness = 1.2;
        targetHeightMult = 0.6;
        break;
      case 4:
        targetLayerSep = 0;
        targetSaturation = 1.3;
        targetBrightness = 1.1;
        targetHeightMult = 1.8;
        break;
      case 5:
        targetLayerSep = 0;
        targetSaturation = 1.0;
        targetBrightness = 1.0;
        targetHeightMult = 0.5;
        break;
    }

    const dampSpeed = 4 * delta;
    visualState.current.layerSep = THREE.MathUtils.lerp(visualState.current.layerSep, targetLayerSep, dampSpeed);
    visualState.current.globalHeight = THREE.MathUtils.lerp(visualState.current.globalHeight, targetHeightMult, dampSpeed);
    visualState.current.brightness = THREE.MathUtils.lerp(visualState.current.brightness, targetBrightness, dampSpeed);
    visualState.current.saturation = THREE.MathUtils.lerp(visualState.current.saturation, targetSaturation, dampSpeed);

    let idx = 0;
    const offset = (GRID_SIZE * SPACING) / 2;

    for (let x = 0; x < GRID_SIZE; x++) {
      for (let z = 0; z < GRID_SIZE; z++) {
        const baseHeight = heights[idx];
        const baseColor = colors[idx];
        const posX = x * SPACING - offset;
        const posZ = z * SPACING - offset;

        const targetColor = new THREE.Color();
        const logColor = baseColor.clone().offsetHSL(0, -0.6, 0.25);

        if (stage <= 1) {
          targetColor.copy(baseColor);
        } else if (stage === 2) {
          targetColor.copy(baseColor).multiplyScalar(0.3);
        } else if (stage === 3) {
          targetColor.copy(logColor);
        } else if (stage === 4) {
          targetColor.copy(baseColor).multiplyScalar(1.2).offsetHSL(0, 0.1, 0);
        } else {
          targetColor.copy(baseColor);
        }

        currentColors[idx].lerp(targetColor, dampSpeed);
        const displayColor = currentColors[idx];

        const rHeight = baseHeight * visualState.current.globalHeight;

        tempObject.position.set(posX, visualState.current.layerSep, posZ);
        tempObject.scale.set(1, rHeight, 1);
        tempObject.updateMatrix();
        meshRefR.current.setMatrixAt(idx, tempObject.matrix);
        if (stage === 1) meshRefR.current.setColorAt(idx, new THREE.Color(displayColor.r, 0, 0));
        else meshRefR.current.setColorAt(idx, displayColor);

        tempObject.position.set(posX, 0, posZ);
        tempObject.scale.set(1, rHeight, 1);
        tempObject.updateMatrix();
        meshRefG.current.setMatrixAt(idx, tempObject.matrix);
        if (stage === 1) meshRefG.current.setColorAt(idx, new THREE.Color(0, displayColor.g * 0.8 + 0.1, 0));
        else meshRefG.current.setColorAt(idx, displayColor);

        tempObject.position.set(posX, -visualState.current.layerSep, posZ);
        tempObject.scale.set(1, rHeight, 1);
        tempObject.updateMatrix();
        meshRefB.current.setMatrixAt(idx, tempObject.matrix);
        if (stage === 1) meshRefB.current.setColorAt(idx, new THREE.Color(0, 0, displayColor.b));
        else meshRefB.current.setColorAt(idx, displayColor);

        idx++;
      }
    }

    meshRefR.current.instanceMatrix.needsUpdate = true;
    meshRefG.current.instanceMatrix.needsUpdate = true;
    meshRefB.current.instanceMatrix.needsUpdate = true;
    meshRefR.current.instanceColor!.needsUpdate = true;
    meshRefG.current.instanceColor!.needsUpdate = true;
    meshRefB.current.instanceColor!.needsUpdate = true;
  });

  return (
    <group>
      {stage === 1 && (
        <group>
          <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
            <Text position={[4, 2.5, 0]} fontSize={0.5} color="#ff4444" anchorX="left">
              R-Layer
            </Text>
            <Text position={[4, 0, 0]} fontSize={0.5} color="#44ff44" anchorX="left">
              G-Layer
            </Text>
            <Text position={[4, -2.5, 0]} fontSize={0.5} color="#4444ff" anchorX="left">
              B-Layer
            </Text>
          </Float>
        </group>
      )}

      <SensorBase />

      <instancedMesh ref={meshRefR} args={[undefined, undefined, GRID_SIZE * GRID_SIZE]}>
        <boxGeometry args={[0.45, 1, 0.45]} />
        <meshStandardMaterial transparent opacity={0.9} roughness={0.1} metalness={0.8} />
      </instancedMesh>
      <instancedMesh ref={meshRefG} args={[undefined, undefined, GRID_SIZE * GRID_SIZE]}>
        <boxGeometry args={[0.45, 1, 0.45]} />
        <meshStandardMaterial transparent opacity={0.9} roughness={0.1} metalness={0.8} />
      </instancedMesh>
      <instancedMesh ref={meshRefB} args={[undefined, undefined, GRID_SIZE * GRID_SIZE]}>
        <boxGeometry args={[0.45, 1, 0.45]} />
        <meshStandardMaterial transparent opacity={0.9} roughness={0.1} metalness={0.8} />
      </instancedMesh>
    </group>
  );
}

function Photons({ active }: { active: boolean }) {
  const count = 100;
  const mesh = useRef<THREE.InstancedMesh>(null!);
  const dummy = new THREE.Object3D();

  useFrame((_state) => {
    if (!active) {
      if (mesh.current.scale.x > 0.01) mesh.current.scale.multiplyScalar(0.9);
      else mesh.current.scale.setScalar(0);
      return;
    }
    if (mesh.current.scale.x < 1) mesh.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);

    const time = _state.clock.getElapsedTime();
    for (let i = 0; i < count; i++) {
      const t = (time * 2 + i * 0.05) % 1;
      const y = 8 * (1 - t);
      const radiusAtY = THREE.MathUtils.lerp(1, 4, t);
      const angle = i * 137.5;
      const r = Math.sqrt((i % 10) / 10) * radiusAtY;

      const x = Math.cos(angle) * r;
      const z = Math.sin(angle) * r;

      dummy.position.set(x, y, z);
      dummy.scale.set(0.05, 0.4, 0.05);
      dummy.rotation.set(0, 0, 0);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    }
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 4, 4]} />
      <meshBasicMaterial color="#ffffaa" transparent opacity={0.6} blending={THREE.AdditiveBlending} depthWrite={false} />
    </instancedMesh>
  );
}

function Scene({ stage }: { stage: number }) {
  return (
    <>
      <ambientLight intensity={0.2} />
      <spotLight position={[20, 30, 20]} angle={0.2} penumbra={1} intensity={2} castShadow />
      <pointLight position={[-10, 5, -10]} intensity={2} color="#4444ff" distance={30} />
      <pointLight position={[10, -5, 10]} intensity={1} color="#ff4444" distance={30} />
      <Environment preset="night" />

      <group rotation={[0, Math.PI / 4, 0]}>
        <CameraLens active={stage === 0} />
        <VolumetricLight active={stage === 0} />
        <SensorPixels stage={stage} />
      </group>

      <Photons active={stage === 0} />

      <Stars radius={150} depth={50} count={3000} factor={4} saturation={0} fade speed={0.5} />
    </>
  );
}

const HistogramMonitor = ({ stage }: { stage: number }) => {
  const bars = useMemo(() => {
    const count = 32;
    const data = new Array(count).fill(0);

    if (stage < 2) return data.map(() => Math.random() * 5 + 2);

    if (stage === 2) {
      return data.map((_, i) => {
        const x = i / count;
        return Math.max(5, Math.exp(-x * 6) * 90 + Math.random() * 5);
      });
    }

    if (stage === 3) {
      return data.map((_, i) => {
        const x = (i - count / 2) / (count / 4);
        return 40 * Math.exp(-x * x * 0.5) + 15 + Math.random() * 10;
      });
    }

    if (stage === 4) {
      return data.map((_, i) => {
        const x = i / count;
        return (Math.sin(x * Math.PI * 4) * 0.3 + 0.7) * 60 + 5;
      });
    }

    if (stage === 5) {
      return data.map((_, i) => {
        if (i > count * 0.9) return 2;
        return 50 + Math.random() * 20;
      });
    }
    return data;
  }, [stage]);

  const curvePath = useMemo(() => {
    if (stage < 2) return "M 0 100 L 100 100";
    if (stage === 2) return "M 0 100 L 100 0";
    if (stage === 3) return "M 0 100 Q 10 20 100 30";
    if (stage === 4) return "M 0 100 C 40 100 40 0 100 0";
    if (stage === 5) return "M 0 100 L 80 20 L 100 20";
    return "M 0 100 L 100 0";
  }, [stage]);

  const spectrumGradient = useMemo(() => {
    if (stage < 2) return "linear-gradient(to right, #000, #333)";
    if (stage === 2) return "linear-gradient(to right, #000, #500, #050, #005)";
    if (stage === 3) return "linear-gradient(to right, #333, #866, #686, #668, #aaa)";
    if (stage === 4) return "linear-gradient(to right, #000, #f00, #0f0, #00f, #fff)";
    if (stage === 5) return "linear-gradient(to right, #000, #a00, #0a0, #00a, #ddd)";
    return "linear-gradient(to right, #000, #fff)";
  }, [stage]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="absolute top-24 right-6 w-72 bg-black/80 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-5 shadow-2xl z-20 hidden lg:block"
    >
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-blue-400" />
          <span className="text-xs font-bold text-gray-200 tracking-wider">SIGNAL MONITOR</span>
        </div>
        <div className="flex gap-1">
          {[1, 2, 3].map((i) => (
            <div key={i} className={`w-1.5 h-1.5 rounded-full ${i === 1 ? "bg-red-500" : i === 2 ? "bg-green-500" : "bg-blue-500"} animate-pulse`} />
          ))}
        </div>
      </div>

      <div className="relative h-40 w-full bg-gray-900/50 rounded-lg border border-gray-700 overflow-hidden mb-3">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(#444 1px, transparent 1px)", backgroundSize: "10px 10px" }}></div>

        <svg className="w-full h-full p-2" viewBox="0 0 100 100" preserveAspectRatio="none">
          <g className="opacity-40">
            {bars.map((h, i) => (
              <motion.rect
                key={i}
                initial={{ height: 0, y: 100 }}
                animate={{ height: h, y: 100 - h }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                x={i * 3.1}
                width={2.5}
                fill="url(#barGradient)"
                rx={0.5}
              />
            ))}
          </g>

          <motion.path
            d={curvePath}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="3"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1, d: curvePath }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            style={{ filter: "drop-shadow(0px 0px 6px rgba(59, 130, 246, 0.6))" }}
          />

          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fff" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.2" />
            </linearGradient>
          </defs>
        </svg>

        <div className="absolute top-2 right-2 text-[10px] text-blue-300 font-mono bg-black/40 px-1 rounded">
          {STAGE_INFO[stage].histogramLabel}
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-[9px] text-gray-500 font-mono mb-1">
          <span>BLACK POINT</span>
          <span>WHITE POINT</span>
        </div>
        <motion.div
          className="h-3 w-full rounded-sm border border-gray-600"
          animate={{ background: spectrumGradient }}
          transition={{ duration: 1 }}
        />
      </div>

      <div className="grid grid-cols-2 gap-2 text-center">
        <div className="bg-gray-800/50 rounded py-2 border border-gray-700">
          <div className="text-[9px] text-gray-400">COLOR SPACE</div>
          <div className="text-xs font-mono font-bold text-gray-200 mt-1">
            {stage < 2 ? "N/A" : stage === 5 ? "sRGB" : "REC.2020"}
          </div>
        </div>
        <div className="bg-gray-800/50 rounded py-2 border border-gray-700">
          <div className="text-[9px] text-gray-400">DYNAMIC RANGE</div>
          <div className="text-xs font-mono font-bold text-gray-200 mt-1">
            {stage < 3 ? "LINEAR" : stage === 3 ? "14+ STOPS" : stage === 5 ? "8 STOPS" : "10 STOPS"}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export interface HDRDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HDRDetailsModal: React.FC<HDRDetailsModalProps> = ({ isOpen, onClose }) => {
  const [stage, setStage] = useState(0);

  const nextStage = () => {
    if (stage < TOTAL_STAGES - 1) setStage((s) => s + 1);
  };

  const prevStage = () => {
    if (stage > 0) setStage((s) => s - 1);
  };

  const resetStage = () => {
    setStage(0);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full h-full max-w-6xl max-h-[90vh] bg-slate-950 rounded-2xl overflow-hidden"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 z-50 p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              <X size={24} className="text-slate-200" />
            </button>

            {/* 3D Canvas Layer */}
            <div className="absolute inset-0">
              <Canvas shadows>
                <OrthographicCamera
                  makeDefault
                  position={[30, 25, 30]}
                  zoom={35}
                  near={-100}
                  far={200}
                  onUpdate={(c) => c.lookAt(0, 4, 0)}
                />
                <Scene stage={stage} />
                <OrbitControls
                  enableZoom={true}
                  minZoom={20}
                  maxZoom={60}
                  minPolarAngle={Math.PI / 4}
                  maxPolarAngle={Math.PI / 3}
                  enablePan={false}
                />
              </Canvas>
            </div>

            {/* Histogram HUD */}
            <HistogramMonitor stage={stage} />

            {/* Navigation Overlay */}
            <div className="absolute bottom-0 left-0 w-full z-10 pointer-events-none">
              <div className="max-w-4xl mx-auto p-6 pb-12 pointer-events-auto">
                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  key={stage}
                  className="bg-black/80 backdrop-blur-2xl border border-gray-800/50 rounded-3xl p-8 shadow-2xl ring-1 ring-white/10"
                >
                  <div className="flex items-start justify-between gap-8">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-800 border border-gray-700 text-blue-400">
                          {STAGE_INFO[stage].icon}
                        </span>
                        <span className="text-xs font-bold uppercase tracking-widest text-blue-500">
                          Step {stage + 1} / {TOTAL_STAGES}
                        </span>
                      </div>
                      <h2 className="text-3xl font-bold mb-4 text-white tracking-tight">{STAGE_INFO[stage].title}</h2>
                      <p className="text-gray-400 leading-relaxed text-lg font-light">
                        {STAGE_INFO[stage].description}
                      </p>
                    </div>

                    <div className="flex flex-col gap-3 shrink-0">
                      <button
                        onClick={nextStage}
                        disabled={stage === TOTAL_STAGES - 1}
                        className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                          stage === TOTAL_STAGES - 1
                            ? "bg-gray-800 text-gray-600 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/50 hover:scale-105 active:scale-95"
                        }`}
                      >
                        <ArrowRight size={28} />
                      </button>
                      <button
                        onClick={prevStage}
                        disabled={stage === 0}
                        className={`w-16 h-12 rounded-xl flex items-center justify-center transition-all ${
                          stage === 0
                            ? "opacity-0 pointer-events-none"
                            : "bg-transparent hover:bg-white/10 text-gray-400 hover:text-white"
                        }`}
                      >
                        <ArrowLeft size={24} />
                      </button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-8 h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-blue-600 to-cyan-400"
                      initial={{ width: `${(stage / (TOTAL_STAGES - 1)) * 100}%` }}
                      animate={{ width: `${(stage / (TOTAL_STAGES - 1)) * 100}%` }}
                      transition={{ duration: 0.5, ease: "circOut" }}
                    />
                  </div>

                  {/* Final CTA */}
                  {stage === TOTAL_STAGES - 1 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-6 flex justify-center"
                    >
                      <button
                        onClick={resetStage}
                        className="flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black font-bold hover:bg-gray-200 transition-colors"
                      >
                        <RotateCcw size={16} />
                        Replay Simulation
                      </button>
                    </motion.div>
                  )}
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
