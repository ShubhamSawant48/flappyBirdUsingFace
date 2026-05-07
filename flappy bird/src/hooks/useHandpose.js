import { useState, useRef, useEffect, useCallback } from 'react';

let globalHandposeModel = null;
let tfBackend = 'webgl';
let isFetching = false;
let tfModule = null;
let tfInitialized = false;

export const preloadHandposeModel = async () => {
  if (globalHandposeModel || isFetching) return;
  isFetching = true;
  try {
    if (!tfModule) tfModule = await import('@tensorflow/tfjs');

    if (!tfInitialized) {
      await tfModule.ready();
      try {
        await tfModule.setBackend('webgl');
        tfBackend = 'webgl';
      } catch (e) {
        console.warn("WebGL unavailable, falling back to CPU...");
        await tfModule.setBackend('cpu');
        tfBackend = 'cpu';
      }
      tfInitialized = true;
      console.log(`✅ TensorFlow initialized on ${tfBackend}.`);
    }

    const handposeModule = await import('@tensorflow-models/handpose');
    globalHandposeModel = await handposeModule.load();
    console.log(`🚀 Handpose loaded on ${tfBackend}!`);
  } catch (error) {
    console.error("Failed to load Handpose:", error);
  }
  isFetching = false;
};

export const waitForTF = async () => {
  if (tfInitialized) return;
  await new Promise((resolve) => {
    const interval = setInterval(() => {
      if (tfInitialized) { clearInterval(interval); resolve(); }
    }, 50);
    setTimeout(() => { clearInterval(interval); resolve(); }, 10000);
  });
};

export const useHandpose = (onJump, isDetecting) => {
  const [modelsLoaded, setModelsLoaded] = useState(globalHandposeModel !== null);
  // ✅ NEW: true only when a hand is confirmed visible in the camera
  const [detectionReady, setDetectionReady] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const detectionLoopRef = useRef(null);
  const canJumpRef = useRef(true);
  const isRunningRef = useRef(false);

  const savedOnJump = useRef(onJump);
  useEffect(() => { savedOnJump.current = onJump; }, [onJump]);

  useEffect(() => {
    const initModel = async () => {
      if (!globalHandposeModel) await preloadHandposeModel();
      setModelsLoaded(true);
    };
    initModel();
  }, []);

  const detect = useCallback(async () => {
    if (!isRunningRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas || !globalHandposeModel) {
      if (isRunningRef.current) detectionLoopRef.current = requestAnimationFrame(detect);
      return;
    }

    if (video.readyState >= 2 && video.videoWidth > 0) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      try {
        const predictions = await globalHandposeModel.estimateHands(video);
        if (!isRunningRef.current) return;

        if (predictions && predictions.length > 0) {
          // ✅ Hand confirmed — signal ready
          setDetectionReady(true);

          const landmarks = predictions[0].landmarks;

          ctx.fillStyle = "#3b82f6";
          for (let i = 0; i < landmarks.length; i++) {
            ctx.beginPath();
            ctx.arc(landmarks[i][0], landmarks[i][1], 6, 0, 2 * Math.PI);
            ctx.fill();
          }

          const getDistance = (p1, p2) =>
            Math.sqrt(Math.pow(p1[0] - p2[0], 2) + Math.pow(p1[1] - p2[1], 2));

          const wrist = landmarks[0];
          const indexKnuckle = landmarks[5];
          const indexTip = landmarks[8];
          const middleKnuckle = landmarks[9];
          const middleTip = landmarks[12];

          const isIndexFolded = getDistance(wrist, indexTip) < (getDistance(wrist, indexKnuckle) * 1.2);
          const isMiddleFolded = getDistance(wrist, middleTip) < (getDistance(wrist, middleKnuckle) * 1.2);

          if (isIndexFolded && isMiddleFolded) {
            ctx.fillStyle = "rgba(255, 0, 0, 0.4)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            if (canJumpRef.current && savedOnJump.current) {
              savedOnJump.current();
              canJumpRef.current = false;
              setTimeout(() => { canJumpRef.current = true; }, 400);
            }
          }
        } else {
          // ✅ No hand — reset ready so game can't proceed without detection
          setDetectionReady(false);
          ctx.save();
          ctx.scale(-1, 1);
          ctx.fillStyle = "rgba(255, 165, 0, 0.9)";
          ctx.font = "bold 24px Arial";
          ctx.fillText("✋ Show your hand!", (-canvas.width / 2) - 130, 36);
          ctx.restore();
        }
      } catch (err) {
        if (tfBackend === 'webgl' && tfModule) {
          console.warn("Switching Handpose to CPU...");
          await tfModule.setBackend('cpu');
          tfBackend = 'cpu';
        }
      }
    }

    if (isRunningRef.current) {
      detectionLoopRef.current = requestAnimationFrame(detect);
    }
  }, []);

  useEffect(() => {
    if (isDetecting && modelsLoaded) {
      setDetectionReady(false); // ✅ Reset on every new detection session
      isRunningRef.current = true;
      detect();
    } else {
      isRunningRef.current = false;
      if (detectionLoopRef.current) cancelAnimationFrame(detectionLoopRef.current);
      detectionLoopRef.current = null;
      setDetectionReady(false);
    }
    return () => {
      isRunningRef.current = false;
      if (detectionLoopRef.current) cancelAnimationFrame(detectionLoopRef.current);
      detectionLoopRef.current = null;
    };
  }, [isDetecting, modelsLoaded, detect]);

  return { modelsLoaded, detectionReady, videoRef, canvasRef };
};