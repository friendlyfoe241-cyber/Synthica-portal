import * as THREE from "three";
import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Clouds, Cloud, Environment, PerspectiveCamera, CameraShake } from "@react-three/drei";
import { CuboidCollider, BallCollider, Physics, RigidBody } from "@react-three/rapier";
import { random } from "maath";

export default function Clouds3D() {
  const shake = useRef();
  return (
    <Canvas
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
      gl={{ alpha: true }}
    >
      <ambientLight intensity={Math.PI / 2} />
      <PerspectiveCamera makeDefault position={[0, -4, 18]} fov={90} onUpdate={(self) => self.lookAt(0, 0, 0)}>
        <spotLight position={[0, 40, 2]} angle={0.5} decay={1} distance={45} penumbra={1} intensity={2000} />
        <spotLight position={[-19, 0, -8]} color="red" angle={0.25} decay={0.75} distance={185} penumbra={-1} intensity={400} />
      </PerspectiveCamera>
      <CameraShake ref={shake} decay decayRate={0.95} maxYaw={0.05} maxPitch={0.01} yawFrequency={4} pitchFrequency={2} rollFrequency={2} intensity={0} />
      <Clouds limit={400} material={THREE.MeshLambertMaterial}>
        <Physics gravity={[0, 0, 0]}>
          {/* We position the clouds high up on the Y axis so they sit nicely along the top menu bar edge */}
          <Puffycloud seed={10} position={[25, 12, 0]} />
          <Puffycloud seed={20} position={[-25, 12, 0]} />
          <Puffycloud seed={30} position={[12, 10, -5]} />
          <Puffycloud seed={40} position={[-12, 10, -5]} />
          <Puffycloud seed={50} position={[0, 10, -2]} />
          <CuboidCollider position={[0, -15, 0]} args={[400, 10, 400]} />
        </Physics>
      </Clouds>
      <Environment preset="city" />
    </Canvas>
  );
}

function Puffycloud({ seed, vec = new THREE.Vector3(), ...props }) {
  const api = useRef();
  const light = useRef();
  const [flash] = useState(() => new random.FlashGen({ count: 10, minDuration: 40, maxDuration: 200 }));
  const contact = (payload) => payload.other.rigidBodyObject?.userData?.cloud && payload.totalForceMagnitude / 1000 > 100 && flash.burst();

  useFrame((state, delta) => {
    const impulse = flash.update(state.clock.elapsedTime, delta);
    if (light.current) light.current.intensity = impulse * 15000;
    if (api.current) {
      api.current.applyImpulse(vec.copy(api.current.translation()).negate().multiplyScalar(0.5));
    }
  });

  return (
    <RigidBody ref={api} userData={{ cloud: true }} onContactForce={contact} linearDamping={4} angularDamping={1} friction={0.1} {...props} colliders={false}>
      <BallCollider args={[4]} />
      <Cloud seed={seed} fade={30} speed={0.1} growth={4} segments={40} volume={6} opacity={0.6} bounds={[6, 3, 1]} />
      <Cloud seed={seed + 1} fade={30} position={[0, 1, 0]} speed={0.5} growth={4} volume={10} opacity={1} bounds={[8, 2, 1]} />
      <pointLight position={[0, 0, 0.5]} ref={light} color="blue" />
    </RigidBody>
  );
}
