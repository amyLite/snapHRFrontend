// MessageContext.js
import { createContext, useState, useContext } from 'react'
export const MessageContext = createContext()

export const MessageProvider = ({ children }) => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [message, setMessage] = useState('')
  const [candidateBlobFlag, setCandidateBlobFlag] = useState(false);
  const [playAudioFlag, setPlayAudioFlag] = useState(false);
  const [botMessageToSpeak, setBotMessageToSpeak] = useState('');
  return (
    <MessageContext.Provider value={{ message, setMessage, candidateBlobFlag, setCandidateBlobFlag, playAudioFlag, setPlayAudioFlag, botMessageToSpeak, setBotMessageToSpeak }}>
      {children}
    </MessageContext.Provider>
  )
}

export const useMessage = () => useContext(MessageContext)
