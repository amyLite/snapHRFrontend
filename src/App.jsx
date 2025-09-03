import { useState } from 'react'
import './App.css'
import ResumeUploader from './components/ResumeUploader'
import StyledResume from './components/StyleResume'
import {Routes, Route } from "react-router-dom";
import OrangeTemplate from './components/OrangeTemplate';
import Edittable from './components/Edittable';
import BulkResumeUploader from './components/BulkResume';
import AskQuestions from './components/AskQuestions';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import { motion } from 'framer-motion';
import Interviewer from './components/Interviewer';
import LiveTranscription from './components/LiveTranscription';
import TextToSpeech from './components/TextToSpeech';
import Gazer from './components/Gazer';
import AudioBlob from './components/AudioBlog';
import { MessageProvider } from './components/MessageContext';
import ProctoringWrapper from './components/Protracting';
import ThankYou from './components/ThankYou';


function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <MessageProvider>
        <Routes>
          <Route path="/" element={<HeroSection/>} />
          <Route path="/bulk" element={<BulkResumeUploader/>} />
          <Route path="/orange/:userName/:userAge" element={<OrangeTemplate/>} />
          <Route path="/editable" element={<Edittable/>}/>
          <Route path="/ask" element={<AskQuestions/>}/>
          <Route path="/navbar" element={<Navbar/>}/>
          <Route path="/bot" element={<LiveTranscription/>}/>
          <Route path="/text" element={<TextToSpeech/>}/>
          <Route path="/gazer" element={<Gazer/>}/>
          <Route path="/interviewer" element={<Interviewer/>}/>
          <Route path="/protractor" element={<ProctoringWrapper/>}/>
          <Route path='/thankyou' element={<ThankYou/>}/>
        </Routes>
      </MessageProvider>
    </div>
  )
}

export default App;
