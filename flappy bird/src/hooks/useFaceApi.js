import { useState, useRef, useEffect, useCallback } from 'react';

export const useFaceApi = (onSmile, isDetecting) => {
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const videoRef = useRef(null);
  const faceBoxCanvasRef = useRef(null);
  
  const detectionLoopRef = useRef(null); 
  const canJumpRef = useRef(true);

  // --- Model Loading (No Change) ---
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

  // --- stopDetection (No Change) ---
  const stopDetection = useCallback(() => {
    if (detectionLoopRef.current) {
      clearTimeout(detectionLoopRef.current);
    }
    const canvas = faceBoxCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, []);

  // --- startDetection (Contains the changes) ---
  const startDetection = useCallback(() => {
    
    const runDetection = async () => {
      if (videoRef.current && !videoRef.current.paused) {
        
        // --- CHANGE 1: Back to 224 for better face detection reliability ---
        const detections = await window.faceapi.detectSingleFace(videoRef.current, new window.faceapi.TinyFaceDetectorOptions({ inputSize: 224 })).withFaceExpressions();

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
        
        // --- CHANGE 2: Set threshold to 0.20 (still very sensitive) ---
        if (detections && detections.expressions.happy > 0.30) { 
          if (canJumpRef.current) {
            onSmile();
            canJumpRef.current = false;
            setTimeout(() => { canJumpRef.current = true; }, 250); 
          }
        }
      }
      // Schedule the next detection
      detectionLoopRef.current = setTimeout(runDetection, 30);
    };

    runDetection();

  }, [onSmile]);

  // --- useEffect hook (No Change) ---
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