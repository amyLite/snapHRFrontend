import React from 'react';
import snaphrlogo from '../assets/snaphrlogo.png'

// Main App component for the AI Blob Animation
const App = () => {
  return (
    // Outer container for centering and full screen height.
    // Background remains white for a light theme.
    <div>
      {/*
        Container for the AI bot logo and the animated blob.
        Uses flexbox to center its content, with a relative position for
        absolute positioning of the blob.
      */}
      <div className="relative flex items-center justify-center w-80 h-80 md:w-96 md:h-96">
        {/*
          The animated blob element.
          - `absolute`: Positions it relative to its parent container.
          - `inset-0`: Stretches it to cover the entire parent.
          - `rounded-full`: Makes it initially a circle.
          // Updated gradient to from-blue-500 via-purple-500 to-pink-500
          - `bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500`: Applies the new vibrant gradient.
          - `animate-blob-rotate`: Custom animation for rotation.
          - `filter blur-3xl opacity-70`: Applies a significant blur and increased opacity for visibility on white.
          - `transform scale-x-125 scale-y-75`: Distorts the circle into an elliptical, blob-like shape.
          // Updated shadow to match the new gradient colors
          - `shadow-xl shadow-purple-500/60`: Stronger shadow with a color from the gradient.
        */}
        <div className="absolute inset-24 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 animate-blob-rotate filter blur-xl opacity-70 transform scale-x-50 scale-y-50 shadow-xl shadow-purple-500/60"></div>

        {/*
          A secondary, slightly smaller blob to enhance the depth and motion.
          - Similar styling to the main blob but with slightly different animation and colors.
          // Updated gradient to from-blue-500 via-purple-500 to-pink-500 for the second blob as well
          - `bg-gradient-to-tl from-blue-500 via-purple-500 to-pink-500`: Applies the new vibrant gradient, slightly inverted direction.
          - `animate-blob-rotate-reverse`: Rotates in the opposite direction.
          - `filter blur-xl opacity-80`: Less intense blur and higher opacity for better presence.
          - `transform scale-x-75 scale-y-125`: Different distortion for variation.
          // Updated shadow to match the new gradient colors
          - `shadow-lg shadow-pink-500/60`: Color-matched shadow.
        */}
        <div className="absolute inset-20 rounded-full bg-gradient-to-tl from-blue-500 via-purple-500 to-pink-500 animate-blob-rotate-reverse filter blur-xl opacity-80 transform scale-x-75 scale-y-125 shadow-lg shadow-pink-500/60"></div>

        {/*
          The actual AI bot logo placeholder.
          - `relative z-10`: Ensures it stays on top of the blurred blobs.
          - `flex items-center justify-center`: Centers its content.
          - `w-48 h-48 md:w-64 md:h-64`: Sets its size, responsive.
          - `bg-blue-700 rounded-full`: Retained a professional dark blue for strong contrast.
          - `text-5xl md:text-7xl font-bold text-white`: Large, bold white text for the "AI" logo.
          - `shadow-2xl shadow-blue-900/50`: Strong shadow for the logo itself.
          - `border-2 border-blue-500`: Adds a subtle border.
        */}
           
        <div class="
            w-[140px] h-[140px]
            bg-[#e0e0e0]
            rounded-full /* Makes the inner div perfectly circular */
            flex justify-center items-center text-center /* Centers the text inside */
            text-lg font-semibold text-gray-700
        ">
            <div className="w-[100px] h-[100px] flex justify-center items-center m-auto rounded-full bg-[#e0e0e0] shadow-[8px_8px_16px_#bebebe,-8px_-8px_16px_#ffffff]">
            <img width={80} className='m-auto' src={snaphrlogo}/>
            </div>
            
        </div>
 
      </div>

      {/*
        Tailwind JIT compilation requires explicit definition of keyframes.
        This ensures the custom animations are included.
      */}
      <style jsx>{`
        @keyframes blob-rotate {
          0% {
            transform: rotate(0deg) scaleX(1.25) scaleY(0.75);
          }
          25% {
            transform: rotate(90deg) scaleX(0.75) scaleY(1.25);
          }
          50% {
            transform: rotate(180deg) scaleX(1.25) scaleY(0.75);
          }
          75% {
            transform: rotate(270deg) scaleX(0.75) scaleY(1.25);
          }
          100% {
            transform: rotate(360deg) scaleX(1.25) scaleY(0.75);
          }
        }

        @keyframes blob-rotate-reverse {
          0% {
            transform: rotate(0deg) scaleX(0.75) scaleY(1.25);
          }
          25% {
            transform: rotate(-90deg) scaleX(1.25) scaleY(0.75);
          }
          50% {
            transform: rotate(-180deg) scaleX(0.75) scaleY(1.25);
          }
          75% {
            transform: rotate(-270deg) scaleX(1.25) scaleY(0.75);
          }
          100% {
            transform: rotate(-360deg) scaleX(0.75) scaleY(1.25);
          }
        }

        .animate-blob-rotate {
          animation: blob-rotate 15s linear infinite; /* Apply rotation animation */
        }

        .animate-blob-rotate-reverse {
          animation: blob-rotate-reverse 18s linear infinite; /* Apply reverse rotation animation */
        }

        /* Ensure smooth animations on different devices */
        *, *::before, *::after {
          -webkit-backface-visibility: hidden;
          -webkit-perspective: 1000;
        }
      `}</style>
    </div>
  );
};

export default App;
