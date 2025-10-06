import React from 'react';

const WebcamView = React.forwardRef(({ faceBoxCanvasRef }, ref) => {
  return (
    <>
      <canvas ref={faceBoxCanvasRef} style={styles.faceBoxCanvas} />
      <video ref={ref} autoPlay muted style={styles.video} playsInline></video>
    </>
  );
});

const styles = {
  video: {
    position: 'absolute',
    bottom: '10px',
    right: '10px',
    width: '120px',
    height: '90px',
    border: '2px solid white',
    borderRadius: '8px',
    transform: 'scaleX(-1)', // Mirror effect
  },
  faceBoxCanvas: {
    position: 'absolute',
    bottom: '10px',
    right: '10px',
    width: '120px',
    height: '90px',
    transform: 'scaleX(-1)', // Mirror effect to match video
  },
};

export default WebcamView;
