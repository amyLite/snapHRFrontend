import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import OrangeTemplate from "./OrangeTemplate";

const ResumeUploader = () => {
  const [file, setFile] = useState(null);
  const [extractedText, setExtractedText] = useState("");
  const [improvedText, setImprovedText] = useState("");
  const [coverLetterText, setCoverLetterText] = useState("");
  const [tailoredResume, setTailoredResume] = useState("");

  const user = { name: 'Alice', age: 25 };


  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a file");

    const formData = new FormData();
    formData.append("file", file);

    try {
      // Upload resume
      const uploadRes = await axios.post("http://0.0.0.0:8000/upload-resume/", formData);
      const extracted_resume_text = uploadRes.data.extracted_text
      setExtractedText(extracted_resume_text);
      console.log("Text extracted", typeof(extracted_resume_text))
      console.log({"extractedText":extracted_resume_text})
      // Improve resume using AI
      const improveRes = await axios.post("http://127.0.0.1:8000/improve-resume/", 
        {text: extracted_resume_text} // ✅ Ensure JSON format
      );

      setImprovedText(improveRes.data);
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong");
    }
  };

  const handleCoverLetter = async () => {
    if (!file) return alert("Please select a file");

    const formData = new FormData();
    formData.append("file", file);

    try {
      // Upload resume
      const uploadRes = await axios.post("http://0.0.0.0:8000/upload-resume/", formData);
      const extracted_resume_text = uploadRes.data.extracted_text
      setExtractedText(extracted_resume_text);
      // Improve resume using AI
      const improveRes = await axios.post("http://127.0.0.1:8000/cover-letter/", 
        {resume: extracted_resume_text,
          cover_letter: coverLetterText
        } // ✅ Ensure JSON format
      );

      setImprovedText(improveRes.data);
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong");
    }
  };

  return (
    <div className="container">
      <h2>AI Resume Generator</h2>
      <Link to={`/orange/${user}`}>Orange Resume</Link>
      <input type="file" accept=".pdf,.docx" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload & Improve</button>
      <textarea 
        placeholder="Paste your cover letter here..." 
        value={coverLetterText} 
        onChange={(e)=>setCoverLetterText(e.target.value)}>
        </textarea>
      <button onClick={handleCoverLetter}>Tailor Resume</button>
      {extractedText && (
        <div>
          <h3>Extracted Resume Text:</h3>
          console.log({extractedText})
          <pre>{extractedText}</pre>
        </div>
      )}

       {improvedText && <OrangeTemplate props={improvedText} />}

      {/* {improvedText && (
        <div>
          <h3>AI-Improved Resume:</h3>
          <h2>{improvedText.name}</h2>
          <p>{improvedText.summary}</p>
          <div>
            <div>
            <h2>Work Experience</h2>
              {improvedText.experience.map((job, index) => (
                <div key={index} style={{ borderBottom: "1px solid #ccc", marginBottom: "20px", paddingBottom: "10px" }}>
                  <h3>{job.jobTitle}</h3>
                  <p><strong>Company:</strong> {job.company}</p>
                  <p><strong>Location:</strong> {job.location}</p>
                  <p><strong>Duration:</strong> {job.duration}{console.log("job duration",job)}</p>
                  <h4>Responsibilities:</h4>
                  <ul>
                    {job.responsibilities.map((task, taskIndex) => (
                      <li key={taskIndex}>{task}</li>
                    ))}
                  </ul>
                </div>
              ))}
    </div>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default ResumeUploader;
