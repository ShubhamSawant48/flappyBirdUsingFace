import React, { createContext, useState, useEffect } from 'react';
import * as handpose from '@tensorflow-models/handpose';
import '@tensorflow/tfjs-backend-webgl';

export const HandposeContext = createContext();

export const HandposeProvider = ({ children }) => {
  const [net, setNet] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadModel = async () => {
      try {
        console.log("⏳ Downloading Handpose model...");
        const model = await handpose.load();

        // 🚨 THE MAGIC WARMUP TRICK 🚨
        // Create an invisible, blank canvas
        console.log("🔥 Forcing WebGL shader compilation in the background...");
        const dummyCanvas = document.createElement('canvas');
        dummyCanvas.width = 640;
        dummyCanvas.height = 480;
        
        try {
           // We feed the blank canvas to the model. 
           // This forces TensorFlow to do the 15-second heavy math right now!
           await model.estimateHands(dummyCanvas); 
        } catch (e) {
           // We can ignore any errors here, the goal is just to trigger the compiler
        }

        setNet(model);
        setIsLoaded(true);
        console.log("🚀 Handpose fully loaded AND compiled on WebGL!");
      } catch (error) {
        console.error("Failed to load Handpose:", error);
      }
    };

    loadModel();
  }, []);

  return (
    <HandposeContext.Provider value={{ net, isLoaded }}>
      {children}
    </HandposeContext.Provider>
  );
};