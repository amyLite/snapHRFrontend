import React, { useState } from 'react';
import axios from 'axios';
import ExcelDownloader from './DownloadExcel';
import Table from './Table';
import loader from "../assets/loader.mp4"
import SaveDailogueBox from './SaveDailogueBox';
import Navbar from './Navbar';
import spin from '../assets/spin.png'

function BulkResumeUploader() {

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [timeTaken, setTimeTaken] = useState(null);
  const [fistScreen, setFirstScreen] = useState(true);
  const [files, setFiles] = useState([]);
  const [numberOfFiles, setNumberOfFiles] = useState(0);
  const [extractedTexts, setExtractedTexts] = useState([]);
  const [improvedTexts, setImprovedTexts] = useState([]);
  const [coverLetterText, setCoverLetterText] = useState("");
  const [tailoredResume, setTailoredResume] = useState("");
  const [loading, setLoading] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const [resumeScaned, setResumeScanned] = useState(0);
  // const [data, setData] = useState(initialData);

  const [sortOrder, setSortOrder] = useState('asc');
  const [sortOrderExp, setSortOrderExp] = useState('asc');

  const handleJobDescriptionChange = (e) => {
    setJobDescription(e.target.value)
  }

  const sortByScore = () => {
    const sorted = [...improvedTexts].sort((a, b) =>
      sortOrder === 'asc' ? a.score - b.score : b.score - a.score
    );
    setImprovedTexts(sorted);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const sortByScoreExp = () => {
    const sorted = [...improvedTexts].sort((a, b) =>
      sortOrderExp === 'asc' ? a.score - b.score : b.score - a.score
    );
    setImprovedTexts(sorted);
    setSortOrderExp(sortOrderExp === 'asc' ? 'desc' : 'asc');
  };

  

  const handleFileChange = (event) => {
    setFiles(Array.from(event.target.files)); // Convert FileList to Array
    setNumberOfFiles(event.target.files.length);
  };

  async function processResumesInChunks(results, jobDescription, chunkSize = 20) {

    const startTime = performance.now();
    const nonEmptyResumes = results.filter(res => res.text !== "");
    
    const chunks = [];
    for (let i = 0; i < nonEmptyResumes.length; i += chunkSize) {
      chunks.push(nonEmptyResumes.slice(i, i + chunkSize));
    }
  
    let allImprovements = [];
  
    await Promise.all(
      chunks.map(async (chunk) => {
        const response = await axios.post(`${API_BASE_URL}/extract-info-bulk/`, {
          resumes: chunk.map(r => r.text),
          jd: jobDescription
        });
        allImprovements = [...allImprovements, ...response.data];
        setResumeScanned(prev => prev + chunk.length);
      })
    );

    const endTime = performance.now();
    setTimeTaken(((endTime - startTime) / 1000).toFixed(2)); // in seconds
    return allImprovements;
  }
  


  const handleUpload = async () => {
    if (files.length === 0) return alert("Please select files");

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });

    try {
      
      setLoading(true);
      setFirstScreen(false);
      // Upload resumes and extract text
      const uploadRes = await axios.post(`${API_BASE_URL}/upload-bulk-resume/`, formData);
      const results = uploadRes.data.results; // [{ filename, text }, ...]

      setExtractedTexts(results.map(res => res.text));

      console.log("Extracted texts:", results);

      // Extract info from  all extracted texts
      let scannedCount = 0;
    //   const improvements = await Promise.all(results.map(async (res) => {
    //     if (res.text !== ""){
    //     const improveRes = await axios.post("http://127.0.0.1:8000/extract-info/", {
    //       text: res.text,
    //       jd: jobDescription
    //     });
    //     setResumeScanned((resumeScaned)=>(resumeScaned+1))
        
    //     return improveRes.data;
    //   }
    // }));
      const improvements = await processResumesInChunks(results, jobDescription, 20);
      setImprovedTexts(improvements);
      console.log("Improvements: ",improvedTexts);
      
      setLoading(false);

    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong during upload");
    }
  };


  return (
    <div>
      <Navbar/>
      {fistScreen ?
      <div className="px-40 w-full mt-40 m-auto items-center">
      <div className='flex flex-row relative gap-10'>
      {/* <input type="file" accept=".pdf,.docx" multiple onChange={handleFileChange} /> */}

      <div>
      <input
        type="file"
        id="file-upload"
        accept=".pdf,.docx"
        multiple
        onChange={handleFileChange}
        className="hidden"
      />

        <label
          htmlFor="file-upload"
          
          className="transition flex whitespace-nowrap bg-violet-200 items-center justify-center h-[40px] px-4 border-2 border-violet-600 hover:bg-violet-300 text-violet-600 font-bold text-sm rounded-2xl cursor-pointer ease-out duration-300"
        >
          Select Resumes
        </label>
        {numberOfFiles===0 ? <></> : <h3 className='text-xs whitespace-nowrap'>{numberOfFiles} files selected</h3>}
      </div>

      <div className='w-[1px] bg-gray-200 h-[200px]'/>

      <textarea
        id="jobDescription"
        className="w-full border border-gray-300 rounded-md p-2 resize-y min-h-[120px] bg-white focus:outline-none focus:border-violet-600"
        value={jobDescription}
        onChange={handleJobDescriptionChange}
        placeholder="Paste or type the job description here..."
      />

      </div>
      <br/>
      <button onClick={handleUpload} className="transition whitespace-nowrap bg-violet-200 items-center justify-center h-[40px] px-4 border-2 border-violet-600 hover:bg-violet-300 hover:border-violet-600 text-violet-600 font-bold text-sm rounded-2xl cursor-pointer ease-out duration-300">
        Start Analysis
      </button>
      </div> :

      <>

      {loading ?<div> <img src={spin} className='w-[60px] m-auto mt-40 animate-spin transition-all ease-in duration-300'/>
                    
                    
                    </div>
                     : 


      <div className="mt-40 mb-5">
              {timeTaken && (
        <p className="text-sm text-gray-500">
          Analyzed {numberOfFiles} Resumes in {timeTaken} seconds
        </p>
      )}

        {improvedTexts!=[] ? <Table props={improvedTexts} flag={loading}/> : <h1>Please refresh</h1>}
        

        
      </div>
      }
      </>
    }
    </div>
  );
}

export default BulkResumeUploader;
