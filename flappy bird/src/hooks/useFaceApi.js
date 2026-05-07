import { useState, useRef, useEffect, useCallback } from 'react';

export const useFaceApi = (onSmile, isDetecting) => {
  const [modelsLoaded, setModelsLoaded] = useState(false);
  // ✅ NEW: true only when a face has been confirmed visible in the camera
  const [detectionReady, setDetectionReady] = useState(false);

  const videoRef = useRef(null);
  const faceBoxCanvasRef = useRef(null);
  const detectionLoopRef = useRef(null);
  const canJumpRef = useRef(true);
  const isRunningRef = useRef(false);

  const savedOnSmile = useRef(onSmile);
  useEffect(() => { savedOnSmile.current = onSmile; }, [onSmile]);

  useEffect(() => {
    const loadModels = async () => {
      try {
        if (!window.faceapi) return;
        await Promise.all([
          window.faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
          window.faceapi.nets.faceExpressionNet.loadFromUri('/models'),
        ]);
        setModelsLoaded(true);
        console.log("✅ FaceAPI models loaded.");
      } catch (error) {
        console.error("Error loading FaceAPI models:", error);
      }
    };

    if (window.faceapi) {
      loadModels();
    } else {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/dist/face-api.min.js';
      script.crossOrigin = "anonymous";
      script.onload = loadModels;
      document.body.appendChild(script);
    }
  }, []);

  const startDetection = useCallback(() => {
    isRunningRef.current = false;
    if (detectionLoopRef.current) clearTimeout(detectionLoopRef.current);

    // ✅ Reset detection ready on every new start
    setDetectionReady(false);
    isRunningRef.current = true;

    const runDetection = async () => {
      if (!isRunningRef.current) return;

      const video = videoRef.current;
      const canvas = faceBoxCanvasRef.current;

      if (
        video && canvas && window.faceapi &&
        !video.paused &&
        video.readyState >= 2 &&
        video.videoWidth > 0 &&
        video.videoHeight > 0
      ) {
        try {
          const displaySize = { width: video.videoWidth, height: video.videoHeight };
          canvas.width = displaySize.width;
          canvas.height = displaySize.height;
          window.faceapi.matchDimensions(canvas, displaySize);

          const detections = await window.faceapi
            .detectSingleFace(video, new window.faceapi.TinyFaceDetectorOptions({ inputSize: 224 }))
            .withFaceExpressions();

          if (!isRunningRef.current) return;

          const ctx = canvas.getContext('2d');
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          if (detections) {
            // ✅ Face confirmed — signal ready to parent
            setDetectionReady(true);

            const resizedDetections = window.faceapi.resizeResults(detections, displaySize);
            const happiness = detections.expressions.happy;
            const isSmiling = happiness > 0.08;

            // Draw face box
            const box = resizedDetections.detection.box;
            ctx.strokeStyle = isSmiling ? "#22c55e" : "#60a5fa";
            ctx.lineWidth = 4;
            ctx.shadowColor = isSmiling ? "#22c55e" : "#3b82f6";
            ctx.shadowBlur = 12;
            ctx.strokeRect(box.x, box.y, box.width, box.height);
            ctx.shadowBlur = 0;

            // Smile badge
            const badgeText = `😊 ${(happiness * 100).toFixed(0)}%`;
            const badgeX = box.x;
            const badgeY = Math.max(box.y - 36, 4);
            const badgeW = 110;
            const badgeH = 30;
            const r = 8;

            ctx.fillStyle = isSmiling ? "rgba(34,197,94,0.85)" : "rgba(59,130,246,0.85)";
            ctx.beginPath();
            ctx.moveTo(badgeX + r, badgeY);
            ctx.lineTo(badgeX + badgeW - r, badgeY);
            ctx.quadraticCurveTo(badgeX + badgeW, badgeY, badgeX + badgeW, badgeY + r);
            ctx.lineTo(badgeX + badgeW, badgeY + badgeH - r);
            ctx.quadraticCurveTo(badgeX + badgeW, badgeY + badgeH, badgeX + badgeW - r, badgeY + badgeH);
            ctx.lineTo(badgeX + r, badgeY + badgeH);
            ctx.quadraticCurveTo(badgeX, badgeY + badgeH, badgeX, badgeY + badgeH - r);
            ctx.lineTo(badgeX, badgeY + r);
            ctx.quadraticCurveTo(badgeX, badgeY, badgeX + r, badgeY);
            ctx.closePath();
            ctx.fill();

            ctx.fillStyle = "#ffffff";
            ctx.font = "bold 16px Arial";
            ctx.fillText(badgeText, badgeX + 8, badgeY + 20);

            if (isSmiling) {
              ctx.fillStyle = "rgba(34,197,94,0.12)";
              ctx.fillRect(0, 0, canvas.width, canvas.height);
            }

            if (isSmiling && canJumpRef.current && savedOnSmile.current) {
              savedOnSmile.current();
              canJumpRef.current = false;
              setTimeout(() => { canJumpRef.current = true; }, 100);
            }
          } else {
            // ✅ No face — reset ready state so game can't start without detection
            setDetectionReady(false);
            const ctx2 = canvas.getContext('2d');
            ctx2.fillStyle = "rgba(0,0,0,0.5)";
            ctx2.fillRect(0, 0, canvas.width, 44);
            ctx2.fillStyle = "rgba(255,165,0,1)";
            ctx2.font = "bold 20px Arial";
            ctx2.fillText("📷 Show your face!", 10, 28);
          }
        } catch (err) {
          // keep loop alive silently
        }
      }

      if (isRunningRef.current) {
        detectionLoopRef.current = setTimeout(runDetection, 30);
      }
    };

    runDetection();
  }, []);

  const stopDetection = useCallback(() => {
    isRunningRef.current = false;
    if (detectionLoopRef.current) clearTimeout(detectionLoopRef.current);
    detectionLoopRef.current = null;
    setDetectionReady(false);

    const canvas = faceBoxCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, []);

  useEffect(() => {
    if (isDetecting && modelsLoaded) startDetection();
    else stopDetection();
    return () => stopDetection();
  }, [isDetecting, modelsLoaded, startDetection, stopDetection]);

  return { modelsLoaded, detectionReady, videoRef, faceBoxCanvasRef };
};