import React from 'react';
import './AppCanvas.css';
import { Canvas } from 'react-three-fiber';
import DemoCube from '../DemoCube/DemoCube';
import CameraControls from '../CameraControls/CameraControls';

function AppCanvas() {
  return (
    <div className="AppCanvas">
      <Canvas colorManagement>
        <ambientLight />
        <directionalLight position={[1, 2, 3]} />
        <CameraControls />
        <DemoCube />
      </Canvas>
    </div>
  );
}

export default AppCanvas;
