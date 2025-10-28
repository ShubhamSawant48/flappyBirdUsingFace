import React from "react";

const WebcamView = React.forwardRef(({ faceBoxCanvasRef }, ref) => {
  return (
    <>
      <video ref={ref} autoPlay muted style={styles.video} playsInline></video>
      <canvas ref={faceBoxCanvasRef} style={styles.faceBoxCanvas} />
    </>
  );
});

const styles = {
  video: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transform: "scaleX(-1)", // Mirror effect
  },
  faceBoxCanvas: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    pointerEvents: "none",
    transform: "scaleX(-1)", // Mirror effect to match video
  },
};

export default WebcamView;
