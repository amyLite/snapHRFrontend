// MessageContext.js
import { createContext, useState, useContext } from 'react'
export const MessageContext = createContext()

export const MessageProvider = ({ children }) => {
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
