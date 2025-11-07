import { useState, useRef, useEffect, useCallback } from 'react';

export const useFaceApi = (onSmile, isDetecting) => {
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const videoRef = useRef(null);
  const faceBoxCanvasRef = useRef(null);
  
  // --- CHANGE 1: Use a ref for the setTimeout ID ---
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

  // --- CHANGE 2: stopDetection now uses clearTimeout ---
  const stopDetection = useCallback(() => {
    if (detectionLoopRef.current) {
      clearTimeout(detectionLoopRef.current); // Use clearTimeout
    }
    const canvas = faceBoxCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, []);

  // --- CHANGE 3: The main detection loop (startDetection) ---
  const startDetection = useCallback(() => {
    
    // Define the async loop function
    const runDetection = async () => {
      if (videoRef.current && !videoRef.current.paused) {
        // We are adding { inputSize: 224 } to speed up the detector
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
        
        if (detections && detections.expressions.happy > 0.25) {
          if (canJumpRef.current) {
            onSmile();
            canJumpRef.current = false;
            // Using a 250ms cooldown for a "snappy" feel
            setTimeout(() => { canJumpRef.current = true; }, 250); 
          }
        }
      }
      // After the detection is done, schedule the next one in 30ms
      detectionLoopRef.current = setTimeout(runDetection, 30);
    };

    // Start the loop for the first time
    runDetection();

  }, [onSmile]); // end of startDetection

  // This useEffect hook handles starting and stopping the loop
  useEffect(() => {
    if (isDetecting) {
        startDetection();
    } else {
        stopDetection();
    }
    return () => stopDetection(); // Cleanup on unmount
  }, [isDetecting, startDetection, stopDetection]);

  return { modelsLoaded, videoRef, faceBoxCanvasRef };
};