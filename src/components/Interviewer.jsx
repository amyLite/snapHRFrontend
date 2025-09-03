import React, { useState, useEffect, useRef } from 'react';
import AudioBlob from './AudioBlog'
import LiveTranscription from './LiveTranscription'
import axios from 'axios';
import { useMessage } from './MessageContext'
import { useSpeech } from 'react-text-to-speech';
import AiBlob from './AiBlob';
import snaphr from '../assets/snaphrTrans.png'
import timer from '../assets/timer.svg'

const DEEPGRAM_API_KEY = '1ee4347525df048e25761750975b03a71c69af24';
const DEEPGRAM_TTS_API_URL = 'https://api.deepgram.com/v1/speak?model=aura-helios-en&encoding=mp3';

const Interviewer = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [botQuestions, setBotQuestions] = useState([]);
  const [idValue, setIdValue] = useState('');
  const [UUIDs, setUUIDs] = useState([]);
  const [showInterviewOverMessage, setShowInterviewOverMessage] = useState(false);
  const [startIntervieFlag, setStartIntervieFlag] = useState(false);
  const [textToRead, setTextToRead] = useState('');
  const { message } = useMessage();
  const {setBotMessageToSpeak} = useMessage();
  const { speechStatus, start, pause, stop } = useSpeech({ text: textToRead });

  const {candidateBlobFlag} = useMessage();
  const {playAudioFlag} = useMessage();
  console.log("message: ", message)
  console.log("Flag", candidateBlobFlag)
  console.log("audio",playAudioFlag)


  {/* TIMER */}

  // Total time in seconds (60 minutes * 60 seconds/minute)
  const INITIAL_TIME_IN_SECONDS = 3600; // 3600 seconds

  // State to hold the current time remaining in seconds
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME_IN_SECONDS);
  // State to control whether the timer is running or paused
  const [isRunning, setIsRunning] = useState(false);
  // useRef to keep track of the interval ID, allowing it to be cleared
  const timerRef = useRef(null);


    // useEffect hook to manage the timer's lifecycle
    useEffect(() => {
      // If the timer is running and there's time left, set up the interval
      if (isRunning && timeLeft > 0) {
        // Set an interval to update the time every second
        setShowInterviewOverMessage(false);
        timerRef.current = setInterval(() => {
          setTimeLeft(prevTime => prevTime - 1); // Decrement time by 1 second
        }, 1000);
      } else if (timeLeft === 0) {
        // If time runs out, stop the timer
        clearInterval(timerRef.current);
        setIsRunning(false); // Set running status to false
        setShowInterviewOverMessage(true);
      }
  
      // Cleanup function: This runs when the component unmounts
      // or when the dependencies (`isRunning`, `timeLeft`) change and the effect re-runs.
      return () => {
        clearInterval(timerRef.current); // Clear the interval to prevent memory leaks
      };
    }, [isRunning, timeLeft]);



      // Function to format the time from seconds into MM:SS format
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60); // Calculate minutes
    const remainingSeconds = seconds % 60; // Calculate remaining seconds

    // Pad with leading zeros if less than 10
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
  };




  const [messages, setMessages] = useState([
    { sender: 'bot', text: botQuestions[0] }
  ])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  // const [currentQuestion, setCurrentQuestion] = useState(botQuestions)
  const [input, setInput] = useState('')

  const handleCandidateAnswer = async (input) => {
    setMessages(prev => [...prev, { sender: 'candidate', text: input }])
    const followupQuestion = await axios.post(`${API_BASE_URL}/evaluate/`, {
      answer: input,
      question: botQuestions[currentQuestionIndex]
    });


    const nextIndex = currentQuestionIndex + 1
    if (nextIndex < botQuestions.length) {
          setTimeout(() => {
            setMessages(prev => [...prev, { sender: 'bot', text: botQuestions[nextIndex] }])
            setCurrentQuestionIndex(nextIndex);

          }, 1000)
        }

    // else{
    //   setTimeout(()=>{
    //     setMessages(prev => [...prev, { sender: 'bot', text: followupQuestion.data}])
    //   },1000)
    // }
  }

  const handleStartInterview = async () => {
    setIsRunning(prevIsRunning => !prevIsRunning); 
    try {
      const response = await axios.post(`${API_BASE_URL}/get-questions/`, {
        questions_id: idValue
      });
  
      console.log("Questions received:", response.data);
      setBotQuestions(response.data);
      setStartIntervieFlag(true);
    } catch (error) {
      console.error("Error fetching questions:", error);
      alert("Incorrect UUID");
    }
  };

  const handleSubmit = () => {
    
    if (message.trim()) {
      handleCandidateAnswer(message)
      setInput('')
    }
  }

  useEffect(() => {
    const fetchUUIDs = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/get-uuid/`);
        console.log("UUIDs: ", response.data);  // ✅ This will be the list
        setUUIDs(response.data);
      } catch (error) {
        console.error("Error fetching UUIDs:", error);
      }
    };
  
    fetchUUIDs();
  }, []);

  useEffect(()=>{
      if (UUIDs.includes(idValue)){
        console.log("VALID")
      }
  }, [idValue])



  useEffect(()=>{
    if(candidateBlobFlag){
      handleSubmit();
      console.log("Triggered")
    }
    const lastSender = messages[messages.length - 1]?.sender;
    
    if(playAudioFlag){
      const lastMessage = messages[messages.length - 1]?.text;
      console.log("LAST MSG: ", lastMessage)
      setTextToRead(lastMessage);
    }
  },[candidateBlobFlag]);
  

  useEffect(() => {
    if (textToRead) {
      console.log("Text to read (updated in state):", textToRead);
      
    }
  }, [textToRead]);
  
  useEffect(() => {
    console.log("Bot questions updated:", botQuestions);
    setMessages([
      { sender: 'bot', text: botQuestions[0] }
    ]);
  }, [botQuestions]);
  

  return (
    <div className='min-h-screen bg-white'>
      <div className='mx-auto h-16 flex justify-between items-center'>
          <img src={snaphr} className="h-10"/>
          <div className='w-[100px] h-[40px] bg-indigo-200 shadow-sm font-bold font-inter text-indigo-800 rounded-lg mr-4 text-center flex items-center justify-center'>
            <img className='w-4 mr-2' src={timer}/>
            {formatTime(timeLeft)}
          </div>
      </div>
     
      
    
      <div className='flex items-center justify-center'>


      {!startIntervieFlag ? 
      <div id='startInterview' className='flex flex-col gap-4'>
        <input type='text' value={idValue} placeholder='enter UUID' onChange={(e)=>setIdValue(e.target.value)} className='text-gray-600 text-left text-lg font-inter font-semibold p-1 bg-white border border-gray-300 rounded-md focus:outline-none focus:border-violet-600'/>
        <button 
        className='px-4 py-2 rounded-full bg-gradient-to-tl from-[#209cff] to-[#68e0cf] text-white shadow-lg outline-none border-none text-md font-semibold focus:outline-none focus:border-none hover:outline-none transition-all duration-300 ease-in-out'
        onClick={()=>handleStartInterview()}>Start Interview</button>
      </div>
      :<> {showInterviewOverMessage ? <h1>Times Up, Thanks for the interview</h1> : 
        <div className='h-[600px] w-[1000px] bg-gray-100 
      shadow-[-8px_-8px_16px_#d5d8f7,_8px_8px_16px_#d5d8f7]
      rounded-xl flex flex-row shadow-lg'> 
        {/* Left Panel (Audio/Video Area Placeholder) */}
        <div className='w-[55%] m-4 rounded-xl bg-gray-100 flex items-center justify-center'>
          <div className='m-auto text-center text-gray-700 font-semibold'>
            {/* <AudioBlob/> */}
            <AiBlob/>
          </div>
        </div>


        {/* Right Panel (Chat Area) */}
        <div className='w-[45%] m-4 ml-1 rounded-xl bg-gray-100 p-4 flex flex-col justify-between'>
          <div className='overflow-y-auto flex-1 pr-2'>
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mt-2 ${msg.sender === 'bot' ? 'text-left' : 'text-right'}`}
              >
                <div className={`inline-block px-4 py-2 rounded-xl max-w-xs shadow 
                  ${msg.sender === 'bot' ? 'bg-white text-gray-600' : 'bg-gradient-to-tl from-[#21d4fd] to-[#7028e4] text-white text-left'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
          <LiveTranscription/>
        </div>
   
      </div>
      
      }</>
      }
    </div>
    
    </div>
  )
}

export default Interviewer
