import { useState, useRef, useEffect, useCallback } from 'react';

export const useFaceApi = (onSmile, isDetecting) => {
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const videoRef = useRef(null);
  const faceBoxCanvasRef = useRef(null);
  const detectionLoopRef = useRef(null);
  const canJumpRef = useRef(true);

  // 🐛 FIX #3: Use a "running" flag so the async loop knows to stop
  // even if it's mid-execution when stopDetection is called.
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
    // 🐛 FIX #3: Stop any existing loop before starting a new one
    isRunningRef.current = false;
    if (detectionLoopRef.current) clearTimeout(detectionLoopRef.current);

    isRunningRef.current = true;

    const runDetection = async () => {
      // 🐛 FIX #3: Check the flag at the START of every iteration.
      // This ensures even a mid-flight async call won't schedule the next tick.
      if (!isRunningRef.current) return;

      if (videoRef.current && !videoRef.current.paused && window.faceapi && faceBoxCanvasRef.current) {
        try {
          const detections = await window.faceapi.detectSingleFace(
            videoRef.current,
            new window.faceapi.TinyFaceDetectorOptions({ inputSize: 224 })
          ).withFaceExpressions();

          // Check again after the await, since async work takes time
          if (!isRunningRef.current) return;

          const canvas = faceBoxCanvasRef.current;
          const displaySize = { width: 120, height: 90 };
          window.faceapi.matchDimensions(canvas, displaySize);

          const ctx = canvas.getContext('2d');
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          if (detections) {
            const resizedDetections = window.faceapi.resizeResults(detections, displaySize);
            window.faceapi.draw.drawDetections(canvas, resizedDetections);

            if (detections.expressions.happy > 0.20 && canJumpRef.current && savedOnSmile.current) {
              savedOnSmile.current();
              canJumpRef.current = false;
              setTimeout(() => { canJumpRef.current = true; }, 100);
            }
          }
        } catch (err) {
          // Ignore Face-API background drops silently
        }
      }

      // Only schedule next tick if still running
      if (isRunningRef.current) {
        detectionLoopRef.current = setTimeout(runDetection, 30);
      }
    };

    runDetection();
  }, []);

  const stopDetection = useCallback(() => {
    // 🐛 FIX #3: Set the flag FIRST so any in-flight async call exits cleanly
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