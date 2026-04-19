import { useState, useRef, useEffect, useCallback } from 'react';

let globalHandposeModel = null;
let tfBackend = 'webgl';
let isFetching = false;
let tfModule = null;

export const preloadHandposeModel = async () => {
  if (globalHandposeModel || isFetching) return;
  isFetching = true;
  try {
    if (!tfModule) tfModule = await import('@tensorflow/tfjs');
    const handposeModule = await import('@tensorflow-models/handpose');

    await tfModule.ready();

    try {
      await tfModule.setBackend('webgl');
      tfBackend = 'webgl';
    } catch (e) {
      console.warn("WebGL unavailable, falling back to CPU...");
      await tfModule.setBackend('cpu');
      tfBackend = 'cpu';
    }

    globalHandposeModel = await handposeModule.load();
    console.log(`🚀 Handpose loaded on ${tfBackend}!`);
  } catch (error) {
    console.error("Failed to load Handpose:", error);
  }
  isFetching = false;
};

export const useHandpose = (onJump, isDetecting) => {
  const [modelsLoaded, setModelsLoaded] = useState(globalHandposeModel !== null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const detectionLoopRef = useRef(null);
  const canJumpRef = useRef(true);

  // 🐛 FIX #4: Use a "running" flag so the async rAF loop can safely exit
  // even when it's mid-flight inside an async estimateHands() call.
  const isRunningRef = useRef(false);

  const savedOnJump = useRef(onJump);
  useEffect(() => {
    savedOnJump.current = onJump;
  }, [onJump]);

  useEffect(() => {
    const initModel = async () => {
      if (!globalHandposeModel) await preloadHandposeModel();
      setModelsLoaded(true);
    };
    initModel();
  }, []);

  const detect = useCallback(async () => {
    // 🐛 FIX #4: Exit immediately if we've been told to stop
    if (!isRunningRef.current) return;

    if (!videoRef.current || !canvasRef.current || !globalHandposeModel) {
      if (isRunningRef.current) detectionLoopRef.current = requestAnimationFrame(detect);
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video.readyState >= 2 && video.videoWidth > 0) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      try {
        const predictions = await globalHandposeModel.estimateHands(video);

        // 🐛 FIX #4: Check flag again after the slow async await
        if (!isRunningRef.current) return;

        if (predictions && predictions.length > 0) {
          const landmarks = predictions[0].landmarks;

          ctx.fillStyle = "#3b82f6";
          for (let i = 0; i < landmarks.length; i++) {
            ctx.beginPath();
            ctx.arc(landmarks[i][0], landmarks[i][1], 6, 0, 2 * Math.PI);
            ctx.fill();
          }

          const getDistance = (p1, p2) => Math.sqrt(Math.pow(p1[0] - p2[0], 2) + Math.pow(p1[1] - p2[1], 2));

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
          ctx.save();
          ctx.scale(-1, 1);
          ctx.fillStyle = "rgba(255, 165, 0, 0.9)";
          ctx.font = "bold 28px Arial";
          ctx.fillText("Scanning for hand... ✋", (-canvas.width / 2) - 150, canvas.height / 2);
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

    // Only schedule next frame if still running
    if (isRunningRef.current) {
      detectionLoopRef.current = requestAnimationFrame(detect);
    }
  }, []);

  useEffect(() => {
    if (isDetecting && modelsLoaded) {
      // 🐛 FIX #4: Set flag before starting loop
      isRunningRef.current = true;
      detect();
    } else {
      // 🐛 FIX #4: Set flag FIRST, then cancel rAF
      isRunningRef.current = false;
      if (detectionLoopRef.current) cancelAnimationFrame(detectionLoopRef.current);
      detectionLoopRef.current = null;
    }

    return () => {
      isRunningRef.current = false;
      if (detectionLoopRef.current) cancelAnimationFrame(detectionLoopRef.current);
      detectionLoopRef.current = null;
    };
  }, [isDetecting, modelsLoaded, detect]);

  return { modelsLoaded, videoRef, canvasRef };
};