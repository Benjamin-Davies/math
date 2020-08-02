import React, { useRef } from 'react';
import { useThree, useFrame, extend } from 'react-three-fiber';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

extend({ OrbitControls });

function CameraControls() {
  const {
    camera,
    gl: { domElement },
  } = useThree();

  const controls = useRef();
  useFrame((state) => controls.current.update());

  return <orbitControls ref={controls} args={[camera, domElement]} />;
}

export default CameraControls;
