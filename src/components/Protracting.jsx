import React, { useEffect, useState } from 'react';
import Interviewer from './Interviewer';

const ProctoringWrapper = ({ children }) => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [isProctoring, setIsProctoring] = useState(false);
  const [idValue, setIdValue] = useState('');
  const [isDisabled, setisDisabled] = useState(true);

  // Start proctoring when user clicks
  const startProctoring = () => {
    
    const docEl = document.documentElement;

    if (docEl.requestFullscreen) docEl.requestFullscreen();
    else if (docEl.mozRequestFullScreen) docEl.mozRequestFullScreen();
    else if (docEl.webkitRequestFullscreen) docEl.webkitRequestFullscreen();
    else if (docEl.msRequestFullscreen) docEl.msRequestFullscreen();

    setIsProctoring(true);
  };

    // Enable button if idValue is not empty
useEffect(() => {
        setisDisabled(idValue.trim() === '');
      }, [idValue]);

  useEffect(() => {
    if (!isProctoring) return;
    
    // 1. Disable text selection
    const disableTextSelection = (e) => e.preventDefault();
    document.addEventListener('selectstart', disableTextSelection);

    // 2. Disable right-click
    const disableRightClick = (e) => e.preventDefault();
    document.addEventListener('contextmenu', disableRightClick);

    // 3. Detect tab switch
    const handleVisibilityChange = () => {
      if (document.hidden) {
        alert('Tab switch detected! Please stay on the test tab.');
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // 4. Detect window blur
    const handleBlur = () => {
      alert('Window out of focus! Switching windows is not allowed.');
    };
    window.addEventListener('blur', handleBlur);

    // 5. Fullscreen exit
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        alert('Please do not exit fullscreen.');
        startProctoring(); // Re-enter fullscreen
      }
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('selectstart', disableTextSelection);
      document.removeEventListener('contextmenu', disableRightClick);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [isProctoring]);

  if (!isProctoring) {
    return (
    <div className='flex flex-col items-center justify-center m-auto h-screen'>
      <div className="flex flex-row items-center gap-4 justify-center bg-white">
        <h2 className="text-xl font-bold">Step 1:</h2>
        <input type='text' value={idValue} placeholder='enter UUID' onChange={(e)=>setIdValue(e.target.value)} className='text-gray-600 text-left text-lg font-inter font-semibold p-1 bg-white border border-gray-300 rounded-md focus:outline-none focus:border-violet-600'/>
      </div>

      <div className="flex flex-row items-center gap-4 justify-center bg-white">
        <h2 className="text-xl font-bold">Step 2:</h2>
        <button
          disabled={isDisabled}
          className={`px-6 py-3 text-white rounded-full ${isDisabled ? 'bg-blue-600 opacity-50 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
          onClick={startProctoring}
        >
          Enter Fullscreen
        </button>
      </div>
      </div>
    );
  }

  return <div style={{ userSelect: 'none' }}><Interviewer/></div>;
};

export default ProctoringWrapper;
