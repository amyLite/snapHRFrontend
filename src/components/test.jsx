import React, { useEffect, useRef, useState, useCallback } from 'react';
import webgazer from 'webgazer'; 

// A flag to ensure webgazer is only initialized once globally
let isWebGazerInitialized = false;

const GazeTracker = () => {
    const contentRef = useRef(null); 
    const [gazeCoords, setGazeCoords] = useState({ x: 0, y: 0 });
    const [isCalibrating, setIsCalibrating] = useState(false);
    const [calibrationMessage, setCalibrationMessage] = useState("Click the points to calibrate");

    // Function to apply styling to video feed and canvas (excluding calibration dots here)
    const applyVideoAndCanvasStyling = useCallback(() => {
        const videoElement = document.getElementById('webgazerVideoFeed');
        const canvasElement = document.getElementById('webgazerCanvas'); 

        const videoWidth = '200px'; 
        const videoHeight = '150px'; 
        const videoBottom = '10px'; 
        const videoLeft = '10px';   

        if (videoElement) {
            videoElement.style.position = 'fixed';
            videoElement.style.bottom = videoBottom;
            videoElement.style.left = videoLeft;
            videoElement.style.width = videoWidth; 
            videoElement.style.height = videoHeight; 
            videoElement.style.zIndex = '9999'; 
            videoElement.style.border = '2px solid #555'; 
            videoElement.style.borderRadius = '8px';
            videoElement.style.transform = 'scaleX(-1)'; 
        }

        if (canvasElement) {
            canvasElement.style.position = 'fixed';
            canvasElement.style.bottom = videoBottom;
            canvasElement.style.left = videoLeft;
            canvasElement.style.width = videoWidth; 
            canvasElement.style.height = videoHeight; 
            canvasElement.style.zIndex = '9999'; 
            canvasElement.style.transform = 'scaleX(-1)'; 
            canvasElement.style.backgroundColor = 'transparent'; 
        }
    }, []); 

    useEffect(() => {
        const setupWebGazer = async () => {
            if (isWebGazerInitialized) {
                console.warn("WebGazer is already initialized. Skipping re-initialization.");
                applyVideoAndCanvasStyling(); 
                return;
            }

            console.log("Initializing WebGazer...");
            isWebGazerInitialized = true;

            webgazer.setRegression('ridge')
                    .setTracker('clmtrackr')
                    .setGazeListener((data, elapsedTime) => {
                        if (data == null) {
                            return;
                        }
                        if (!isCalibrating) { 
                            console.log(`Gaze X: ${data.x}, Y: ${data.y}`);
                            setGazeCoords({ x: data.x.toFixed(2), y: data.y.toFixed(2) });

                            const predictionPoint = document.getElementById('webgazerDot'); 
                            if (predictionPoint) {
                                predictionPoint.style.zIndex = '99999'; 
                            }
                        }
                    })
                    .begin(); 

            webgazer.showVideoPreview(true); 
            webgazer.showPredictionPoints(true); 

            // Apply initial styling for video/canvas after WebGazer elements are in DOM
            setTimeout(applyVideoAndCanvasStyling, 1000); 

            return () => {
                console.log("Cleaning up WebGazer...");
                webgazer.end(); 

                const videoElement = document.getElementById('webgazerVideoFeed');
                if (videoElement && videoElement.parentNode) {
                    videoElement.parentNode.removeChild(videoElement);
                }

                const canvasElement = document.getElementById('webgazerCanvas'); 
                if (canvasElement && canvasElement.parentNode) {
                    canvasElement.parentNode.removeChild(canvasElement);
                }
                
                isWebGazerInitialized = false;
            };
        };

        setupWebGazer();
    }, [isCalibrating, applyVideoAndCanvasStyling]); 

    // Function to start the calibration process
    const startCalibration = () => {
        setIsCalibrating(true);
        setCalibrationMessage("Stare at each YELLOW dot and click it. Do this 9 times.");
        webgazer.clearData(); 
        webgazer.showCalibrationPoints(true); 
        webgazer.resume(); 

        // >>>>>>>>>>> IMPORTANT: Style calibration points immediately after they are shown <<<<<<<<<<<
        // Give WebGazer a very brief moment to render its default points
        setTimeout(() => {
            const calibrationPoints = document.querySelectorAll('.webgazerTarget');
            console.log(`Found ${calibrationPoints.length} calibration points after showing.`); // DEBUGGING
            calibrationPoints.forEach(point => {
                point.style.zIndex = '99999'; // Ensure dots are ON TOP of the overlay (overlay is 20000)
                point.style.backgroundColor = 'yellow'; // Highly contrasting color
                point.style.borderRadius = '50%'; 
                point.style.width = '30px'; 
                point.style.height = '30px'; 
                point.style.border = '3px solid blue'; 
            });
        }, 100); // 100ms delay to allow elements to be created
    };

    const endCalibration = () => {
        setIsCalibrating(false);
        setCalibrationMessage("Calibration complete!");
        webgazer.showCalibrationPoints(false); 
        webgazer.showPredictionPoints(true); 
    };

    return (
<div ref={contentRef} style={{ position: 'relative', minHeight: '100vh', padding: '20px' }}>
            {/* Display Gaze Coordinates */}
            <div style={{
                position: 'fixed',
                top: '10px',
                left: '10px',
                zIndex: 10000,
                background: 'rgba(0, 0, 0, 0.7)',
                color: 'white',
                padding: '10px',
                borderRadius: '5px'
            }}>
                Gaze X: {gazeCoords.x}, Y: {gazeCoords.y}
            </div>

            {/* Your main content goes here */}
            <div className='w-[800px] h-[600px] flex flex-col m-auto justify-between'>
            <div class="flex justify-between w-full">
              <div onClick={handleClick1} class="w-5 h-5 bg-red-300 text-center border rounded-full"></div>
              <div class="w-5 h-5 bg-green-300 text-center border rounded-full"></div>
              <div class="w-5 h-5 bg-blue-300 text-center border rounded-full"></div>
            </div>

            <div class="flex justify-between w-full">
              <div class="w-5 h-5 bg-red-300 text-center border rounded-full"></div>
              <div class="w-5 h-5 bg-green-300 text-center border rounded-full"></div>
              <div class="w-5 h-5 bg-blue-300 text-center border rounded-full"></div>
            </div>

            <div class="flex justify-between w-full">
              <div class="w-5 h-5 bg-red-300 text-center border rounded-full"></div>
              <div class="w-5 h-5 bg-green-300 text-center border rounded-full"></div>
              <div class="w-5 h-5 bg-blue-300 text-center border rounded-full"></div>
            </div>

            </div>
            <div className='w-[800px] flex flex-col m-auto hidden'>
            <h1>Welcome to my WebGazer App!</h1>
            <p>This is some text.</p>
            <div style={{ background: 'lightblue', padding: '20px', margin: '20px', zIndex: 1, position: 'relative' }}>
                <h2>My Awesome Div</h2>
                <p>More content inside the div.</p>
            </div>
            <p>Scroll down to see more content...</p>
            <div style={{ background: 'lightgreen', padding: '20px', margin: '20px', height: '500px', zIndex: 1, position: 'relative' }}>
                <h3>Another Div</h3>
                <p>This div is further down the page.</p>
            </div>
            <button>Click Me</button>
            <p>A final paragraph.</p>
            </div>
        </div>
    );
};

export default GazeTracker;