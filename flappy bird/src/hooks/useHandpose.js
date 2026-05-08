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

  // ✅ FIX: detectionReady uses ref internally — NEVER setState inside rAF loop.
  // The rAF loop only writes to detectionReadyRef (no re-render).
  // A setInterval every 300ms safely syncs ref → state for the parent component.
  // This completely stops the re-render cascade that was killing fist detection.
  const detectionReadyRef = useRef(false);
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

  // ✅ Safe interval to sync detectionReadyRef → state (outside rAF loop)
  useEffect(() => {
    if (!isDetecting) {
      detectionReadyRef.current = false;
      setDetectionReady(false);
      return;
    }
    const sync = setInterval(() => {
      setDetectionReady(detectionReadyRef.current);
    }, 300);
    return () => clearInterval(sync);
  }, [isDetecting]);

  // ✅ detect has empty deps — created ONCE, never recreated
  // Zero re-renders inside this function — all state via refs only
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
          // ✅ Write to ref only — no setState, no re-render
          detectionReadyRef.current = true;

          const landmarks = predictions[0].landmarks;

          // Draw tracking dots
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
          const indexTip    = landmarks[8];
          const middleKnuckle = landmarks[9];
          const middleTip   = landmarks[12];
          const ringKnuckle = landmarks[13];
          const ringTip     = landmarks[16];

          // ✅ BETTER FIST: looser threshold (1.3) + 2-of-3 fingers rule
          // Old code required BOTH index AND middle at 1.2 — too strict.
          // Now any 2 of 3 fingers at 1.3 threshold = fist confirmed.
          // Partial or slightly open fists now reliably register.
          const isIndexFolded  = getDistance(wrist, indexTip)  < (getDistance(wrist, indexKnuckle)  * 1.3);
          const isMiddleFolded = getDistance(wrist, middleTip) < (getDistance(wrist, middleKnuckle) * 1.3);
          const isRingFolded   = getDistance(wrist, ringTip)   < (getDistance(wrist, ringKnuckle)   * 1.3);

          const foldedCount = [isIndexFolded, isMiddleFolded, isRingFolded].filter(Boolean).length;
          const isFist = foldedCount >= 2;

          if (isFist) {
            // Red flash feedback
            ctx.fillStyle = "rgba(255, 0, 0, 0.35)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // JUMP text so user knows fist was detected
            ctx.fillStyle = "#ffffff";
            ctx.font = "bold 26px Arial";
            ctx.fillText("✊ JUMP!", 10, 34);

            if (canJumpRef.current && savedOnJump.current) {
              savedOnJump.current();
              canJumpRef.current = false;
              // ✅ 300ms cooldown — responsive but prevents double-jumps
              setTimeout(() => { canJumpRef.current = true; }, 300);
            }
          }

        } else {
          // ✅ Write to ref only — no setState, no re-render
          detectionReadyRef.current = false;

          ctx.save();
          ctx.scale(-1, 1);
          ctx.fillStyle = "rgba(255, 165, 0, 0.9)";
          ctx.font = "bold 22px Arial";
          ctx.fillText("✋ Show your hand!", (-canvas.width / 2) - 140, 36);
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
  }, []); // ✅ empty deps — loop is stable, never recreated

  useEffect(() => {
    if (isDetecting && modelsLoaded) {
      detectionReadyRef.current = false;
      isRunningRef.current = true;
      detect();
    } else {
      isRunningRef.current = false;
      if (detectionLoopRef.current) cancelAnimationFrame(detectionLoopRef.current);
      detectionLoopRef.current = null;
      detectionReadyRef.current = false;
    }
    return () => {
      isRunningRef.current = false;
      if (detectionLoopRef.current) cancelAnimationFrame(detectionLoopRef.current);
      detectionLoopRef.current = null;
    };
  }, [isDetecting, modelsLoaded, detect]);

  return { modelsLoaded, detectionReady, videoRef, canvasRef };
};