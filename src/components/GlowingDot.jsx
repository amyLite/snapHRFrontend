import React from 'react';

const GlowingDot = () => {
  return (
    <div>
      {/* Container for the glowing dot */}
      <div className="relative flex items-center justify-center">
        {/*
          The glowing red circular dot.
          - `w-16 h-16`: Defines the size of the dot.
          - `rounded-full`: Makes it perfectly circular.
          - `bg-red-500`: Sets the base color of the dot to red.
          - `animate-pulse-glow`: Custom animation for the glowing effect.
        */}
        <div className="
          w-2 h-2 md:w-2 md:h-2
          rounded-full
          bg-red-500
          relative z-10 /* Ensure it's above any potential blur layers */
          flex items-center justify-center
          text-white text-xs font-bold
          shadow-md /* Basic shadow for initial depth */
        ">
          {/* Optional: Add text or an icon inside the dot */}
          Dot
        </div>

        {/*
          An overlay element to create the "glow" effect using a blur.
          - `absolute inset-0`: Positions it exactly over the dot.
          - `bg-red-500`: Uses the same red color for the glow.
          - `rounded-full`: Maintains the circular shape.
          - `filter blur-xl`: Applies a large blur to create the soft glow.
          - `opacity-75`: Makes the glow slightly transparent.
          - `animate-pulse-glow-blur`: Custom animation for the blur effect.
          - `z-0`: Ensures it's behind the main dot.
        */}
        <div className="
          absolute
          bg-red-500
          rounded-full
          filter blur-xl md:blur-2xl lg:blur-3xl
          opacity-75
          animate-pulse-glow-blur
          z-0
        "></div>
      </div>

      {/*
        Tailwind JIT compilation requires explicit definition of keyframes.
        This ensures the custom animations for the glow are included.
      */}
      <style jsx>{`
        @keyframes pulse-glow {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 0 10px rgba(239, 68, 68, 0.7); /* red-500 with opacity */
          }
          50% {
            transform: scale(1.05);
            box-shadow: 0 0 25px rgba(239, 68, 68, 1); /* brighter red-500 */
          }
        }

        @keyframes pulse-glow-blur {
          0%, 100% {
            transform: scale(1.1);
            opacity: 0.75;
          }
          50% {
            transform: scale(1.3);
            opacity: 0.95;
          }
        }

        .animate-pulse-glow {
          animation: pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        .animate-pulse-glow-blur {
          animation: pulse-glow-blur 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default GlowingDot;
