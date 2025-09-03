import React, { useState, useEffect, useRef } from 'react';
import { useMessage } from './MessageContext'
import recorder from '../assets/recorder.svg'
import stopRecorder from '../assets/stopRecorder.svg'
import GlowingDot from './GlowingDot';

// IMPORTANT: Replace with your actual Deepgram API Key.
// WARNING: Do NOT expose your API key in client-side code in a production environment.
// Use a backend server to proxy requests to Deepgram for security.
const DEEPGRAM_API_KEY = '1ee4347525df048e25761750975b03a71c69af24'; // <--- REPLACE THIS!

// Deepgram WebSocket API endpoint - NOW SET TO 48000 HZ
const DEEPGRAM_API_URL = 'wss://api.deepgram.com/v1/listen?encoding=linear16&sample_rate=48000&channels=1&interim_results=true&punctuate=true&model=nova-2';

// AudioWorklet Processor code as a string
// This code will run in a separate audio thread.
const audioWorkletProcessorCode = `
class AudioRecorderProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.port.onmessage = (event) => {
      // Handle messages from the main thread if needed
    };
  }

  process(inputs, outputs, parameters) {
    const input = inputs[0]; // Get the first input (microphone)
    if (input.length > 0) {
      const audioData = input[0]; // Get the first channel's audio data (Float32Array)
      // Send the raw audio data back to the main thread
      this.port.postMessage(audioData);
    }
    return true; // Keep the processor alive
  }
}

registerProcessor('audio-recorder-processor', AudioRecorderProcessor);
`;

function LiveTranscription() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState(""); // Stores final, accumulated transcription
  const [interimTranscription, setInterimTranscription] = useState(""); // Stores the current interim transcription
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('Idle');
  const [audioLevel, setAudioLevel] = useState(0); // State for audio level (0-100)
  const [micTrackStatus, setMicTrackStatus] = useState('inactive'); // Status of microphone track

  const audioContextRef = useRef(null);
  const mediaStreamSourceRef = useRef(null);
  const audioWorkletNodeRef = useRef(null); // Ref for AudioWorkletNode
  const deepgramSocketRef = useRef(null);
  const analyserNodeRef = useRef(null); // Ref for AnalyserNode
  const animationFrameIdRef = useRef(null); // Ref for animation frame
  const mediaStreamRef = useRef(null); // Keep a reference to the MediaStream

  const [transHeight, setTransHeight] = useState(0);

  const { setMessage } = useMessage();
  const {setCandidateBlobFlag} = useMessage();
  const {setPlayAudioFlag} = useMessage();

  

  // Effect to clean up resources when the component unmounts
  useEffect(() => {
    return () => {
      stopRecording();
    };
  }, []);

  const startRecording = async () => {
    setPlayAudioFlag(false);
    setCandidateBlobFlag(false);
    setTransHeight(100)
    setError(null);
    setTranscription('');
    setInterimTranscription(''); // Reset interim transcription
    setIsRecording(true);
    setStatus('Requesting microphone...');
    setAudioLevel(0); // Reset audio level
    setMicTrackStatus('pending');

    if (DEEPGRAM_API_KEY === 'YOUR_DEEPGRAM_API_KEY') {
      setError("Please replace 'YOUR_DEEPGRAM_API_KEY' with your actual Deepgram API key. The current key is a placeholder.");
      setIsRecording(false);
      setStatus('Error');
      return;
    }

    try {
      // 1. Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream; // Store stream for track status monitoring
      setStatus('Microphone access granted. Initializing AudioContext...');
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();

      // IMPORTANT: Attempt to resume AudioContext to ensure it's running
      // Browsers often suspend AudioContext until a user gesture.
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
        console.log('AudioContext resumed.');
      }

      const currentAudioContextSampleRate = audioContextRef.current.sampleRate;
      console.log('AudioContext sample rate:', currentAudioContextSampleRate);

      mediaStreamSourceRef.current = audioContextRef.current.createMediaStreamSource(stream);

      // Register the AudioWorklet processor
      const workletBlob = new Blob([audioWorkletProcessorCode], { type: 'application/javascript' });
      const workletUrl = URL.createObjectURL(workletBlob);
      await audioContextRef.current.audioWorklet.addModule(workletUrl);
      URL.revokeObjectURL(workletUrl); // Clean up the Blob URL immediately

      // Create an AudioWorkletNode instance
      audioWorkletNodeRef.current = new AudioWorkletNode(audioContextRef.current, 'audio-recorder-processor');
      
      // Connect the microphone source to the AudioWorkletNode
      mediaStreamSourceRef.current.connect(audioWorkletNodeRef.current);
      // Connect the AudioWorkletNode to the audio context destination (optional, but keeps it active)
      audioWorkletNodeRef.current.connect(audioContextRef.current.destination);

      // 2. Establish WebSocket connection to Deepgram
      setStatus('Connecting to Deepgram WebSocket...');
      deepgramSocketRef.current = new WebSocket(DEEPGRAM_API_URL, ['token', DEEPGRAM_API_KEY]);

      deepgramSocketRef.current.onopen = () => {
        console.log('Deepgram WebSocket connected successfully.');
        setStatus('Connected to Deepgram. Sending audio...');
        
        // Listen for messages (audio data) from the AudioWorkletNode
        audioWorkletNodeRef.current.port.onmessage = (event) => {
          const audioData = event.data; // This is a Float32Array from the worklet

          // Log the raw audio data to check for non-zero values
          const hasSound = audioData.some(sample => Math.abs(sample) > 0.001); // Check for values above a very small threshold
          if (hasSound) {
            console.log('AudioWorklet: Received non-zero audio data chunk.'); // Keep this for crucial debugging
          } else {
            // console.log('AudioWorklet: Received silent audio data chunk.'); // Uncomment for verbose logging
          }

          // Convert Float32Array to 16-bit PCM (Int16Array) for Deepgram
          // No resampling needed as Deepgram API URL now matches native sample rate
          const pcmData = new Int16Array(audioData.length);
          for (let i = 0; i < audioData.length; i++) {
            pcmData[i] = Math.max(-1, Math.min(1, audioData[i])) * 0x7FFF;
          }
          
          if (deepgramSocketRef.current.readyState === WebSocket.OPEN) {
            deepgramSocketRef.current.send(pcmData.buffer);
            // console.log('Sent audio chunk to Deepgram. Chunk size:', pcmData.buffer.byteLength); // Uncomment for verbose logging
          } else {
            console.warn('WebSocket not open, cannot send audio. ReadyState:', deepgramSocketRef.current.readyState);
          }
        };
      };

      deepgramSocketRef.current.onmessage = (event) => {
        console.log('Received message from Deepgram:', event.data); // Log raw message
        const data = JSON.parse(event.data);

        if (data.type === 'Error') {
          console.error('Deepgram API Error:', data.message);
          setError(`Deepgram API Error: ${data.message}`);
          setStatus('Error from Deepgram');
          stopRecording();
          return;
        }

        if (data.channel && data.channel.alternatives && data.channel.alternatives.length > 0) {
          const transcript = data.channel.alternatives[0].transcript;
          console.log('Deepgram Transcript:', transcript, 'Is Final:', data.is_final);
          
          if (data.is_final) {
            // Append final transcript to the main transcription
            setTranscription((prev) => prev + (prev.length > 0 && transcript.length > 0 ? ' ' : '') + transcript);
            setInterimTranscription(''); // Clear interim once a final result is received
          } else {
            // Update interim transcription with the latest non-final result
            setInterimTranscription(transcript);
          }
          setStatus('Transcribing...');
        } else {
          console.log('Deepgram message without transcript:', data);
        }
      };

      deepgramSocketRef.current.onclose = (event) => {
        console.log('Deepgram WebSocket closed:', event.code, event.reason);
        setIsRecording(false);
        setStatus('Disconnected');
        cleanupAudioResources();
      };

      deepgramSocketRef.current.onerror = (event) => {
        console.error('Deepgram WebSocket error:', event);
        setError('WebSocket error. This might be due to an invalid API key, network issues, or Deepgram service problems.');
        setStatus('WebSocket Error');
        setIsRecording(false);
        cleanupAudioResources();
      };

    } catch (err) {
      console.error('Error accessing microphone or connecting to Deepgram:', err);
      setError(`Could not start recording. Please ensure microphone access is granted and your API key is correct. Error: ${err.message}`);
      setStatus('Error');
      setIsRecording(false);
      cleanupAudioResources();
    }
  };

  /**
   * Stops the recording process.
   * - Closes the WebSocket connection.
   * - Stops the microphone stream.
   * - Cleans up audio resources.
   */
  const stopRecording = () => {
    setMessage(transcription);
    setPlayAudioFlag(true);
    setCandidateBlobFlag(true);
    setTransHeight(0)
    setIsRecording(false);
    setStatus('Stopping recording...');
    if (animationFrameIdRef.current) {
      cancelAnimationFrame(animationFrameIdRef.current);
      animationFrameIdRef.current = null;
    }
    setAudioLevel(0); // Reset audio level on stop

    if (deepgramSocketRef.current) {
      if (deepgramSocketRef.current.readyState === WebSocket.OPEN || deepgramSocketRef.current.readyState === WebSocket.CONNECTING) {
        deepgramSocketRef.current.close();
      }
      deepgramSocketRef.current = null;
    }
    cleanupAudioResources();
    setStatus('Idle');
    setTranscription('');
    setInterimTranscription('');
  };

  /**
   * Helper function to stop microphone tracks and close AudioContext.
   */
  const cleanupAudioResources = () => {
    // Disconnect and nullify AudioWorkletNode
    if (audioWorkletNodeRef.current) {
      audioWorkletNodeRef.current.disconnect();
      audioWorkletNodeRef.current.port.onmessage = null; // Remove message listener
      audioWorkletNodeRef.current = null;
    }
    if (analyserNodeRef.current) {
      analyserNodeRef.current.disconnect();
      analyserNodeRef.current = null;
    }
    if (mediaStreamSourceRef.current) {
      mediaStreamSourceRef.current.disconnect();
      mediaStreamSourceRef.current = null;
    }
    // Stop all tracks on the MediaStream
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().then(() => {
        console.log('AudioContext closed.');
        audioContextRef.current = null;
      }).catch(e => console.error('Error closing AudioContext:', e));
    }
    setMicTrackStatus('inactive'); // Reset mic track status
  };

  return (
    // <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
      <div className="bg-gray-100 p-1 w-full">

      <div className="rounded-lg mb-1 mt-2">

        
          
          <div
            className={`w-full min-h-[${transHeight}px] max-h-[200px] bg-white rounded-md overflow-y-auto text-black-500 leading-relaxed mb-2`}
            
          >
            {!transcription && !interimTranscription && (isRecording ?<div className='flex flex-row gap-6 p-2 m-auto justify-center items-center'>
              {/* Red Dot */}
               <div className="w-2 h-2 rounded-full bg-gradient-to-t from-red-600 to-red-300 shadow-[0_0_10px_5px_rgba(255,0,0,0.6)] ml-4 mt-2"> 
               </div>
               <p className='text-gray-500'>Recording...</p> </div> : '')}
            

            {/* Display accumulated final transcription + current interim transcription */}
            
            {transcription !== '' ?
              <p className="text-gray-500 px-4 pt-2 text-md">{transcription}</p>
            :<></>}

            {interimTranscription !== '' ?
              <p className="text-gray-500 px-4 pb-2 text-md">{interimTranscription}</p>
            :<></>}
            
            
          </div>
        </div>


        <div className="text-center">
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`px-4 py-2 rounded-full outline-none border-none text-sm font-semibold focus:outline-none focus:border-none hover:outline-none hover:border-none transition-all duration-300 ease-in-out
              ${isRecording
                ? 'bg-gradient-to-tl from-[#f77062] to-[#fe5196] text-white shadow-lg'
                : 'bg-gradient-to-tl from-[#209cff] to-[#68e0cf] text-white shadow-lg'
              }`}
          >
            {isRecording ? <div className='inline-block flex items-center justify-center'><img src={stopRecorder} className='w-6 mr-2'/>Stop Answering</div> : <div className='inline-block flex items-center justify-center'><img src={recorder} className='w-4 mr-2'/>Start Answering</div>}
          </button>
          
        </div>



      </div>
    // </div>
  );
}

export default LiveTranscription;
