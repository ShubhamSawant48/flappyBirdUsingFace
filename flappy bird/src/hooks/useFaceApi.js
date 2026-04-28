import { useState, useRef, useEffect, useCallback } from 'react';

export const useFaceApi = (onSmile, isDetecting) => {
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const videoRef = useRef(null);
  const faceBoxCanvasRef = useRef(null);
  const detectionLoopRef = useRef(null);
  const canJumpRef = useRef(true);
  const isRunningRef = useRef(false);

  const savedOnSmile = useRef(onSmile);
  useEffect(() => {
    savedOnSmile.current = onSmile;
  }, [onSmile]);

  useEffect(() => {
    const loadModels = async () => {
      try {
        if (!window.faceapi) return;
        await Promise.all([
          window.faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
          window.faceapi.nets.faceExpressionNet.loadFromUri('/models'),
        ]);
        setModelsLoaded(true);
        console.log("✅ FaceAPI models loaded successfully.");
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
    isRunningRef.current = true;

    const runDetection = async () => {
      if (!isRunningRef.current) return;

      const video = videoRef.current;
      const canvas = faceBoxCanvasRef.current;

      if (
        video &&
        canvas &&
        window.faceapi &&
        !video.paused &&
        video.readyState >= 2 &&
        video.videoWidth > 0 &&
        video.videoHeight > 0
      ) {
        try {
          const displaySize = {
            width: video.videoWidth,
            height: video.videoHeight,
          };

          canvas.width = displaySize.width;
          canvas.height = displaySize.height;
          window.faceapi.matchDimensions(canvas, displaySize);

          const detections = await window.faceapi
            .detectSingleFace(
              video,
              new window.faceapi.TinyFaceDetectorOptions({ inputSize: 224 })
            )
            .withFaceExpressions();

          if (!isRunningRef.current) return;

          const ctx = canvas.getContext('2d');
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          if (detections) {
            const resizedDetections = window.faceapi.resizeResults(detections, displaySize);
            const happiness = detections.expressions.happy;

            // ✅ Draw a thick, bright face box — color changes green when smiling enough
            const box = resizedDetections.detection.box;
            const isSmiling = happiness > 0.08; // lowered threshold

            ctx.strokeStyle = isSmiling ? "#22c55e" : "#60a5fa";
            ctx.lineWidth = 4;
            ctx.shadowColor = isSmiling ? "#22c55e" : "#3b82f6";
            ctx.shadowBlur = 12;
            ctx.strokeRect(box.x, box.y, box.width, box.height);
            ctx.shadowBlur = 0;

            // ✅ Large pill-shaped badge above the face box
            const badgeText = `😊 ${(happiness * 100).toFixed(0)}%`;
            const badgeX = box.x;
            const badgeY = box.y - 36;
            const badgeW = 110;
            const badgeH = 30;
            const radius = 8;

            // Pill background
            ctx.fillStyle = isSmiling ? "rgba(34,197,94,0.85)" : "rgba(59,130,246,0.85)";
            ctx.beginPath();
            ctx.moveTo(badgeX + radius, badgeY);
            ctx.lineTo(badgeX + badgeW - radius, badgeY);
            ctx.quadraticCurveTo(badgeX + badgeW, badgeY, badgeX + badgeW, badgeY + radius);
            ctx.lineTo(badgeX + badgeW, badgeY + badgeH - radius);
            ctx.quadraticCurveTo(badgeX + badgeW, badgeY + badgeH, badgeX + badgeW - radius, badgeY + badgeH);
            ctx.lineTo(badgeX + radius, badgeY + badgeH);
            ctx.quadraticCurveTo(badgeX, badgeY + badgeH, badgeX, badgeY + badgeH - radius);
            ctx.lineTo(badgeX, badgeY + radius);
            ctx.quadraticCurveTo(badgeX, badgeY, badgeX + radius, badgeY);
            ctx.closePath();
            ctx.fill();

            // Badge text
            ctx.fillStyle = "#ffffff";
            ctx.font = "bold 16px Arial";
            ctx.fillText(badgeText, badgeX + 8, badgeY + 20);

            // ✅ Green flash overlay when smile triggers flap
            if (isSmiling) {
              ctx.fillStyle = "rgba(34, 197, 94, 0.15)";
              ctx.fillRect(0, 0, canvas.width, canvas.height);
            }

            // ✅ Trigger flap — just a tiny smile needed (8% confidence)
            if (isSmiling && canJumpRef.current && savedOnSmile.current) {
              savedOnSmile.current();
              canJumpRef.current = false;
              setTimeout(() => { canJumpRef.current = true; }, 100);
            }

          } else {
            // No face found
            ctx.fillStyle = "rgba(0,0,0,0.5)";
            ctx.fillRect(0, 0, canvas.width, 44);
            ctx.fillStyle = "rgba(255, 165, 0, 1)";
            ctx.font = "bold 20px Arial";
            ctx.fillText("📷 Show your face!", 10, 28);
          }
        } catch (err) {
          // Silently keep loop alive
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

  return { modelsLoaded, videoRef, faceBoxCanvasRef };
};