import React, { useState } from 'react';
import axios from 'axios';
import ExcelDownloading from './DownloadExcel';
import Table from './Table';
import loader from "../assets/loader.mp4"
import Navbar from './Navbar';
import spin from '../assets/spin.png'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function AskQuestions() {
  const [fistScreen, setFirstScreen] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [skillQuestions, setSkillQuestions] = useState({});
  const [answer, setAnswer] = useState(null);
  const [file, setFile] = useState(null);
  const [numberOfFiles, setNumberOfFiles] = useState(0);
  const [extractedText, setExtractedText] = useState('');
  const [improvedTexts, setImprovedTexts] = useState([]);
  const [saveQuestions, setSaveQuestions] = useState(false);
  const [isSaving, setisSaving] = useState(false);
  const [uuid, setuuid] = useState(null);
  const [tailoredResume, setTailoredResume] = useState("");
  const [loading, setLoading] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const [followUp, setFollowUp] = useState(null);
  const [loadingFollowUp, setLoadingFollowUp] = useState(false);
  const [loadingAnswer, setLoadingAnswer] = useState(false);
  const [sortOrder, setSortOrder] = useState('asc');
  const [sortOrderExp, setSortOrderExp] = useState('asc');

  const [selectedCategory, setSelectedCategory] = useState("Skills_questions");
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentIndexOfSkill, setCurrentIndexOfSkill] = useState(0);

  const category_quetions = questions[selectedCategory] || [];
  const skill_questions = questions["Skills_questions"] || {};

  const [selectedSkill, setSelectedSkill] = useState(skill_questions[0]);

  const handleCategoryClick = (category) => {
    setFollowUp(null);
    if (questions[category]) {
        setSelectedCategory(category);
        setCurrentIndex(0);
        if (questions[category] === "Skills_questions"){
          setSelectedSkill(questions["Skills_questions"][0]);
          setSkillQuestions(questions["Skills_questions"]);
          setCurrentIndex(0);
        }
        setSelectedSkill(null);
      }
  };
  
  const handleSkillClick = (skill) => {
    setFollowUp(null);
    if (skill_questions[skill]){
      setSelectedSkill(skill);
      setCurrentIndex(0);
      console.log("Selected key : ", selectedSkill)
    }
  }

  const handleFollowUp = async (quiz) => {
    setLoadingFollowUp(true);
    setAnswer(null);
    const followupQuiz = await axios.post("http://127.0.0.1:8000/follow-up/", {
        text:quiz
    });
    setLoadingFollowUp(false);
    setFollowUp(followupQuiz)
  }

  const handleAnswer = async (quiz) => {
    setLoadingAnswer(true);
    const ans = await axios.post("http://127.0.0.1:8000/answer/", {
        text:quiz
    });
    setLoadingAnswer(false);
    setAnswer(ans)
  }

  

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

  const handleSaveToDashbord = async () => {
    setisSaving(true);
    const saveReport = await axios.post("http://127.0.0.1:8000/push-questions/");
    setisSaving(false);
    setSaveQuestions(true);
    setuuid(saveReport.data)

    return saveReport
  }

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setNumberOfFiles(event.target.files.length);
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a file");

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      setFirstScreen(false);
      // Upload resumes and extract text
      const uploadRes = await axios.post("http://127.0.0.1:8000/upload-resume/", formData);
      const extracted_resume_text = uploadRes.data.extracted_text
      setExtractedText(extracted_resume_text);

      console.log("Extracted texts:", extracted_resume_text);


     // Ask questions resume using AI
      const ques = await axios.post("http://127.0.0.1:8000/ask-questions/", 
        {text: extractedText,
         jd: jobDescription} // ✅ Ensure JSON format
        );
        setQuestions(ques.data)

      // Extract info from  all extracted texts
      
      setLoading(false);

    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong during upload");
    }
  };
  console.log("Improvements: ",improvedTexts);

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
        onChange={handleFileChange}
        className="hidden"
      />

        <label
          htmlFor="file-upload"
          
          className="transition flex whitespace-nowrap bg-violet-200 items-center justify-center h-[40px] px-4 border-2 border-violet-600 hover:bg-violet-300 text-violet-600 font-bold text-sm rounded-2xl cursor-pointer ease-out duration-300"
        >
          Select Resume
        </label>
        {numberOfFiles===0 ? <></> : <h3 className='text-xs whitespace-nowrap'>{numberOfFiles} files selected</h3>}
      </div>

      <div className='w-[1px] bg-gray-200 h-[200px]'/>

      <textarea
        id="jobDescription"
        className="w-full border border-gray-300 rounded-md p-2 resize-y min-h-[120px] bg-white text-sm focus:outline-none focus:border-violet-600"
        value={jobDescription}
        onChange={handleJobDescriptionChange}
        placeholder="Paste or type the job description here..."
      />

      </div>
      <br/>
      <button onClick={handleUpload} className="transition whitespace-nowrap bg-violet-200 items-center justify-center h-[40px] px-4 border-2 border-violet-600 hover:bg-violet-300 text-violet-600 font-bold text-sm rounded-2xl cursor-pointer ease-out duration-300">
        Generate Questions
      </button>
      </div> :

      <>

      {loading ? <div> <img src={spin} className='w-[60px] m-auto mt-40 animate-spin transition-all ease-in duration-300'/>
  
                          
                          </div> : 


      <div className="mt-40 mb-5 m-auto">

        {/* {questions && questions.skills_questions.map((ques, index) => (
            <h2 key={index}>Skill questions: {ques}</h2>
            
            ))} */}
<div className='flex flex-col mx-12 gap-2 font-sans'>
  <div className='flex flex-row'>

<div className="flex flex-row gap-2 mx-auto bg-violet-100 rounded-full px-5 py-2">
        {Object.keys(questions).map((key) => (
          <button
            key={key}
            onClick={() => {handleCategoryClick(key); setAnswer(null);}}
            className={`px-2 py-2 rounded-full transition-all duration-100 border-none text-sm md:text-xs sm:text-xs lg:text-sm xl:text-sm font-semibold ${
              selectedCategory === key ? 'bg-violet-600 text-white focus:outline-none' : 'bg-violet-200 text-gray-800 focus:outline-none hover:bg-violet-300'
            }`}
          >
            {key.replace('_', ' ').replace('questions', 'Questions')}
          </button>
        ))}
    </div>
    <div>
    <button 
          className='flex items-center gap-2 text-xs bg-white border-2 border-black shadow-md font-bold hover:bg-gray-200 hover:border-black px-2 py-2 rounded-lg whitespace-nowrap transition-all ease-in duration-100'
          onClick={()=>handleSaveToDashbord()}>
            Save
          </button> 
    {isSaving && <p>Saving...</p>}
    {uuid && <p>{uuid}</p>}
    </div>
  </div>


      {/* Question Display */}
      {selectedCategory && (
        <div className="border p-2 rounded overflow-y-auto max-h-[450px] w-[100%]">
        {loadingFollowUp ? 
            <div> <img src={spin} className='w-[60px] m-auto mt-40 animate-spin transition-all ease-in duration-300'/>
                                
                                </div>
          :

        <>  

        {/* Skills Display */}
        {selectedCategory === "Skills_questions" && 

            <div className="flex flex-row gap-2 mx-auto bg-violet-100 rounded-full px-5 py-2 overflow-x-auto">
              {console.log("selected Skill, ", selectedSkill)}
            {Object.keys(questions.Skills_questions).map((key) => (
              <button
                key={key}
                onClick={() => {handleSkillClick(key); setAnswer(null);}}
                className={`px-2 py-2 rounded-full transition-all duration-100 border-none text-sm md:text-xs sm:text-xs lg:text-sm xl:text-sm font-semibold ${
                  selectedSkill=== key ? 'bg-violet-600 text-white focus:outline-none' : 'bg-violet-200 text-gray-800 focus:outline-none hover:bg-violet-300'
                }`}
              >
                {key}
              </button>
            ))}
            </div>
          }
            {followUp ? <p className="text-lg font-serif text-gray-800 font-medium font-medium mb-4 p-10">{followUp.data}</p> : 
              <>{selectedSkill ? <p className="text-lg font-serif text-gray-800 font-medium mb-4 p-10">{skill_questions[selectedSkill][currentIndex]}</p> : 
            <p className="text-lg font-serif text-gray-800 font-medium mb-4 p-10">{category_quetions[currentIndex]}</p> }</>
            }
            {/* Answer para */}
            {loadingAnswer ? <div> <img src={spin} className='w-[60px] m-auto mt-40 animate-spin transition-all ease-in duration-300'/>

                                
                                </div> : 
             <ul className='mb-4'>{answer && 
                
                answer.data.map((ans, index) => (
                  
                    ans.startsWith("CODE") ? (
                     <SyntaxHighlighter language="python" style={oneDark} wrapLongLines>
                        {ans.replace("CODE", "")}
                      </SyntaxHighlighter>) :
                      (
                    <li key={index} className="text-sm font-medium bg-teal-100 m-1 p-1 inline-block border border-teal-300 rounded-md">{ans}</li>
                      )
                    
                )) }
                </ul>
             }
        </>
        }

          
          {console.log("category quetions: ", category_quetions)}

          {/* Navigation Buttons */}

          {/* Previous button */}
          <div className="flex justify-between mt-10">
            <button
              onClick={() => {setCurrentIndex((prev) => Math.max(prev - 1, 0)); setFollowUp(null); setAnswer(null);}}
              disabled={currentIndex === 0}
              className="px-4 py-1 border border-black bg-white-600 text-black text-sm md:text-xs sm:text-xs lg:text-sm xl:text-sm font-bold rounded-2xl outline-none hover:border-black hover:bg-gray-200 focus:outline-none disabled:opacity-50"
            >
              Previous
            </button>

          <div className='flex flex-row gap-3'>


            {/* Answer Button */}

            <button
              // onClick={() => {handleAnswer(followUp ? followUp.data : category_quetions[currentIndex])}}
              onClick={() => {
                if (followUp){
                  return handleAnswer(followUp.data)
                }
                else if (selectedSkill){
                  return handleAnswer(skill_questions[selectedSkill][currentIndex])
                }
                else{
                  return handleAnswer(category_quetions[currentIndex])
                }
              }}
              className="px-4 py-1 bg-teal-600 text-white text-sm font-bold rounded outline-none focus:outline-none disabled:opacity-50"
            >
              Answer
            </button>

            {/* Follow up button */}
            <button className='px-4 py-1 bg-violet-600 text-white text-sm font-bold rounded outline-none focus:outline-none disabled:opacity-50' 
              onClick={() => {
                if (selectedSkill){
                 return handleFollowUp(skill_questions[selectedSkill][currentIndex])
                }
                else{
                 return handleFollowUp(category_quetions[currentIndex])
                }
              }
              }
              >
              Follow Up
            </button>
            </div>

              {/* Next Button */}
            <button
                onClick={() =>{
                    setCurrentIndex((prev) => 
                    {
                 
                      if (selectedSkill){
                        return Math.min(prev + 1, Math.max(skill_questions[selectedSkill].length - 1, 0))
                      }
                      else{
                        return Math.min(prev + 1, Math.max(category_quetions.length - 1, 0))
                      }
                    }
                    
                    );
                    setFollowUp(null);
                    setAnswer(null);
                }
                  }
              disabled={currentIndex === (selectedSkill ? skill_questions[selectedSkill].length - 1 : category_quetions.length - 1)}
              className="px-4 py-1 border border-black bg-white-600 text-black text-sm md:text-xs sm:text-xs lg:text-sm xl:text-sm font-bold rounded-2xl outline-none hover:border-black hover:bg-gray-200 focus:outline-none disabled:opacity-50"
            >
                {console.log("Current Index: ", currentIndex)}
              Next
            </button>


          </div>
        </div>
      )}
      
    </div>
    </div>
      }
      </>
    }
    </div>
  );
}

export default AskQuestions;
