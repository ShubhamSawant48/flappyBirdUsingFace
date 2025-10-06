import { useState, useRef, useEffect, useCallback } from 'react';

export const useFaceApi = (onSmile, isDetecting) => {
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const videoRef = useRef(null);
  const faceBoxCanvasRef = useRef(null);
  const detectionIntervalRef = useRef(null);
  const canJumpRef = useRef(true);

  // --- Model Loading ---
  useEffect(() => {
    const loadModels = async () => {
      try {
        if (!window.faceapi) return;
        await Promise.all([
          window.faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
          window.faceapi.nets.faceExpressionNet.loadFromUri('/models'),
        ]);
        setModelsLoaded(true);
        console.log("FaceAPI models loaded successfully.");
      } catch (error) {
        console.error("Error loading FaceAPI models:", error);
      }
    };
    if (window.faceapi) loadModels();
    else document.getElementById('faceapi-script')?.addEventListener('load', loadModels);
  }, []);

  const stopDetection = useCallback(() => {
    clearInterval(detectionIntervalRef.current);
    const canvas = faceBoxCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, []);

  // --- Face Detection Logic ---
  const startDetection = useCallback(() => {
    detectionIntervalRef.current = setInterval(async () => {
      if (videoRef.current && !videoRef.current.paused) {
        const detections = await window.faceapi.detectSingleFace(videoRef.current, new window.faceapi.TinyFaceDetectorOptions()).withFaceExpressions();

        const canvas = faceBoxCanvasRef.current;
        const displaySize = { width: 120, height: 90 };
        if (canvas) {
          window.faceapi.matchDimensions(canvas, displaySize);
          const resizedDetections = window.faceapi.resizeResults(detections, displaySize);
          const ctx = canvas.getContext('2d');
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          if (resizedDetections) {
            window.faceapi.draw.drawDetections(canvas, resizedDetections);
          }
        }
        
        if (detections && detections.expressions.happy > 0.30) {
          if (canJumpRef.current) {
            onSmile();
            canJumpRef.current = false;
            setTimeout(() => { canJumpRef.current = true; }, 300);
          }
        }
      }
    }, 80);
  }, [onSmile]);

  useEffect(() => {
    if (isDetecting) {
        startDetection();
    } else {
        stopDetection();
    }
    return () => stopDetection();
  }, [isDetecting, startDetection, stopDetection]);

  return { modelsLoaded, videoRef, faceBoxCanvasRef };
};
