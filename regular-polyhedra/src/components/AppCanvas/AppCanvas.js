import React from 'react';
import './AppCanvas.css';
import { Canvas } from 'react-three-fiber';
import CameraControls from '../CameraControls/CameraControls';
import { Hexagon } from '../../polygons/ConvexFinitePlanarPolygon';
import { MeshPhongMaterial, DoubleSide } from 'three';

function AppCanvas() {
  return (
    <div className="AppCanvas">
      <Canvas colorManagement>
        <ambientLight />
        <directionalLight position={[1, 2, 3]} />
        <CameraControls />
        <mesh
          geometry={Hexagon.geometry}
          material={new MeshPhongMaterial({ side: DoubleSide })}
        />
      </Canvas>
    </div>
  );
}

export default AppCanvas;
