import React, {useEffect, useRef, useState} from 'react'
import AutoPaginateText from './AutoPagination'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import phone from '../assets/phone.svg'
import email from '../assets/email.svg'
import location from '../assets/location.svg'
import link from '../assets/link.svg'
import passportsize from '../assets/pasportsize.jpeg'
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { useLocation, useParams } from 'react-router-dom'



const OrangeTemplate = ({props}) => {
    const { userName, userAge } = useParams();
    console.log("Imprved Text: ", props.name)

    {/* Initialize List of Job Tities */}


    

    

        const [LJobTitles, setLJobTitles] = useState();
        const [LCompanies, setLCompanies] = useState();
        const [LDurations, setLDurations] = useState();
        const [LLocations, setLLocations] = useState();
        const [LResponsibilities, setLResponsibilities] = useState();
        
        const [editIndex, setEditIndex] = useState(null);
        const [tempName, setTempName] = useState('');
      
        {/* Handle Job Title */}
        const handleJobTitleEdit = (index) => {
          setEditIndex(index);
          setTempName(LJobTitles[index]);
        };
      
        const handleJobTitleSave = () => {
          const updatedNames = [...LJobTitles];
          updatedNames[editIndex] = tempName;
          setLJobTitles(updatedNames);
          setEditIndex(null);
        };

        {/* Handle Companies */}
        const handleCompaniesEdit = (index) => {
            setEditIndex(index);
            setTempName(LCompanies[index]);
          };
        
          const handleCompaniesSave = () => {
            const updatedNames = [...LCompanies];
            updatedNames[editIndex] = tempName;
            setLCompanies(updatedNames);
            setEditIndex(null);
          };

        {/* Handle Durations */}
        const handleDurationsEdit = (index) => {
            setEditIndex(index);
            setTempName(LDurations[index]);
          };
        
          const handleDurationsSave = () => {
            const updatedNames = [...LDurations];
            updatedNames[editIndex] = tempName;
            setLDurations(updatedNames);
            setEditIndex(null);
          };

        {/* Handle Locations */}
        const handleLocationsEdit = (index) => {
            setEditIndex(index);
            setTempName(LLocations[index]);
          };
        
          const handleLocationsSave = () => {
            const updatedNames = [...LLocations];
            updatedNames[editIndex] = tempName;
            setLLocations(updatedNames);
            setEditIndex(null);
          };

        {/* Handle Responsibilities */}
        const handleResponsibilitiesEdit = (indexPri, indexSec) => {
            setEditIndex([indexPri, indexSec]);
            setTempName(LResponsibilities[indexPri][indexSec]);
          };
        
        const handleResponsibilitiessSave = () => {
            const updatedNames = [...LResponsibilities];
            updatedNames[editIndex[0]][editIndex[1]] = tempName;
            setLResponsibilities(updatedNames);
            setEditIndex(null);
          };



    {/* Above code is in test phase */}

    const resumeRef = useRef(null);
    const lastPositionRef = useRef();
    const borderPositionRef = useRef();

    const [jobText, setJobText] = useState()

    const Ycoordinate = ()=>{
        if (lastPositionRef.current) {
            const rect = lastPositionRef.current.getBoundingClientRect();
            const yPosition = rect.bottom; // The Y-coordinate of the element
            console.log("Y Position:", yPosition);
        }
        }

    const Bordercoordinate = ()=>{
        if (borderPositionRef.current) {
            const rectt = borderPositionRef.current.getBoundingClientRect();
            const BPosition = rectt.bottom; // The Y-coordinate of the element
            console.log("Border Position:", BPosition);
        }
        }

    useEffect(()=>{     
            const jobTitles = [];
            const companies = [];
            const durations = [];
            const locations = [];   
            const responsibilitiess = [];

            for (let i = 0; i < props.experience.length; i++) {
                jobTitles.push(props.experience[i].jobTitle);
                companies.push(props.experience[i].company);
                durations.push(props.experience[i].duration);
                locations.push(props.experience[i].location);
                responsibilitiess.push(props.experience[i].responsibilities)
          }
          console.log("Job Titles: ",jobTitles)
          setLJobTitles(jobTitles);
          setLCompanies(companies);
          setLDurations(durations);
          setLLocations(locations);
          setLResponsibilities(responsibilitiess);
          console.log(" L Companies Titles: ",responsibilitiess)
          

        }
          
          ,[]
        )
        console.log(" L Companies Titles: ",LResponsibilities)

    const downloadPDF = () => {
        const options = {
          margin:       1,
          filename:     'document.pdf',
          image:        { type: 'jpeg', quality: 0.98 },
          html2canvas:  { scale: 2 },
          jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' },
          pagebreak: { mode: ['css', 'legacy'] },
        };
        html2pdf()
          .from(resumeRef.current)
          .set(options)
          .save();
      };




  return (
    <div>
    <div ref={borderPositionRef} style={{minHeight:"70rem", height:"auto"}} className='flex-wrap rounded-lg border border-gray-300 sm:w-[20rem] sm:h-[28.3rem] md:w-[30rem] md:h-[42.42rem] lg:w-[50rem] lg:min-h-min xl:w-[60rem] lg:h-[84.84]'>
        <div className='sm:p-[20px] md:p-[40px] lg:p-[40px] xl:p-[40px]' ref={resumeRef}>
            <div ref={lastPositionRef}>
            <div className='grid grid-cols-5 gap-0'> {/* 5 columns Grid */}
                <div className='col-span-3'>     {/* Left 3 columns Grid */}
                    <h3 className='sm:text-base md:text-2xl lg:text-3xl xl:text-3xl text-left roboto font-bold' style={{color:"#5365a3"}}>{props.name}</h3>  {/* Name */}
                    <div className='flex flex-row gap-2'> {/* phone  email address */}
                        <div className='flex flex-row gap-2' >
                            <img style={{width:"10px"}} src={phone}/> <p className='flex items-center' style={{fontSize:"10px"}}>{props.phone}</p>
                        </div>
                        <div className='flex flex-row gap-2' >
                            <img style={{width:"10px"}} src={email}/> <p className='flex items-center' style={{fontSize:"10px"}}>{props.email}</p>
                        </div>
                        <div className='flex flex-row gap-2' >
                            <img style={{width:"10px"}} src={link}/>  <p className='flex items-center' style={{fontSize:"10px"}}>LinkedIn</p>
                        </div>
                        <div className='flex flex-row gap-2' >
                            <img style={{width:"10px"}} src={location}/> <p className='flex items-center' style={{fontSize:"10px"}}>{props.address}</p>
                        </div>
                    </div>
                </div>
                <div className='col-span-2'> {/* Photo */}
                    <img className='w-[100px] h-[100px] border rounded-full' style={{justifySelf:"end", borderColor:"#5365a3", borderWidth:"2px"}} src={passportsize}/>
                </div>
            </div>
            {/* Header Ends here */}


            <div className='grid grid-cols-5 gap-0 pt-[20px]'>  {/* Body Section */}
                <div className='col-span-3 pr-[30px]'>  {/* Left Body */}
                    <div id="experience">
                    <h4 className='avoid-break sm:text-base md:text-base lg:text-base xl:text-base text-left roboto' style={{color:"#5365a3"}}>Experience</h4>
                    <hr/>
                    {props.experience.map((exp, index)=>(
                        <div key={index} className='text-left roboto pt-[10px]'>
                            {/* <form className='sm:text-base md:text-base lg:text-base xl:text-base font-medium bg-white'>
                                <input placeholder={exp.jobTitle} onChange={(e) => setJobText(e.target.value)} className='bg-white' type='text' value={jobText}/>
                                </form> */}
                            
                            {/* JOB TITLE */}
                            <>
                                {editIndex === index ? (
                                    <>
                                    <input
                                        type="text"
                                        value={tempName}
                                        onChange={(e) => setTempName(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleJobTitleSave()}
                                    />
                                    <button onClick={handleJobTitleSave}>Save</button>
                                    </>
                                ) : (
                                    <>
                                   {LJobTitles ? <>{LJobTitles[index]} <button onClick={() => handleJobTitleEdit(index)}>Edit</button></> : <p>Loading...</p> } 
                                    </>
                                )}
                            </>

                            {/* COMPANY NAME */}
                            <h4 className='sm:text-sm md:text-sm lg:text-sm xl:text-sm text-left flex flex-row'>
                                
                            {editIndex === index ? (
                                    <>
                                    <input
                                        type="text"
                                        value={tempName}
                                        onChange={(e) => setTempName(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleCompaniesSave()}
                                    />
                                    <button onClick={handleCompaniesSave}>Save</button>
                                    </>
                                ) : (
                                    <>
                                   {LCompanies ? <>{LCompanies[index]} <button onClick={() => handleCompaniesEdit(index)}>Edit</button></> : <p>Loading...</p> } 
                                    </>
                                )}

                                &nbsp;&nbsp;&nbsp;

                            {/* DURATION */}

                            {editIndex === index ? (
                                    <>
                                    <input
                                        type="text"
                                        value={tempName}
                                        onChange={(e) => setTempName(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleDurationsSave()}
                                    />
                                    <button onClick={handleDurationsSave}>Save</button>
                                    </>
                                ) : (
                                    <>
                                   {LDurations ? <>{LDurations[index]} <button onClick={() => handleDurationsEdit(index)}>Edit</button></> : <p>Loading...</p> } 
                                    </>
                                )}
                                            
                            </h4>

                            {/* LOCATION */}

                            <div className='sm:text-xs md:text-xs lg:text-xs xl:text-xs'>
                            {editIndex === index ? (
                                    <>
                                    <input
                                        className='bg-white'
                                        type="text"
                                        value={tempName}
                                        onChange={(e) => setTempName(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleLocationsSave()}
                                    />
                                    <button onClick={handleLocationsSave}>Save</button>
                                    </>
                                ) : (
                                    <>
                                   {LLocations ? <>{LLocations[index]} <button onClick={() => handleLocationsEdit(index)}>Edit</button></> : <p>Loading...</p> } 
                                    </>
                                )}
                            </div>


                            {exp.responsibilities.map((res, index)=>(
                                <li key={index} className='sm:text-xs md:text-xs lg:text-xs xl:text-xs pr-[30px]'>
                                    {res}
                                                                {/* {editIndex[index] === indexSec ? (
                                    <>
                                    <input
                                        className='bg-white'
                                        type="text"
                                        value={tempName}
                                        onChange={(e) => setTempName(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleResponsibilitiessSave()}
                                    />
                                    <button onClick={handleResponsibilitiessSave}>Save</button>
                                    </>
                                ) : (
                                    <>
                                   {LResponsibilities[index] ? <>{LResponsibilities[index][indexSec]} <button onClick={() => handleResponsibilitiesEdit(index, indexSec)}>Edit</button></> : <p>Loading...</p> } 
                                    </>
                                )} */}
                                </li>
                            ))}

                        </div>
                    ))}
                    </div>

                    <h4 className='sm:text-base md:text-base lg:text-base xl:text-base text-left roboto pt-[30px]' style={{color:"#5365a3"}}>Education</h4>
                    <hr/>
                    <div className='text-left roboto pt-[10px]'>
                        <h3 className='sm:text-base md:text-base lg:text-base xl:text-base'>Bachler of Technology</h3>
                        <div className='flex flex-row'>
                            <h4 className='sm:text-sm md:text-sm lg:text-sm xl:text-sm text-left'>NIT Silchar &nbsp;&nbsp;&nbsp;</h4>
                            <p className='sm:text-sm md:text-sm lg:text-sm xl:text-sm text-right italic'>2016-2020</p>
                        </div>
                        
                        <p className='sm:text-xs md:text-xs lg:text-xs xl:text-xs'>Silchar, ASSAM</p>
                        <p className='sm:text-xs md:text-xs lg:text-xs xl:text-xs italic pr-[30px]'>
                            7.8 CGPA
                        </p>
                    </div>
                </div>
                <div className='col-span-2'>
                    <h4 className='sm:text-base md:text-base lg:text-base xl:text-base text-left roboto' style={{color:"#5365a3"}}>Summary</h4>
                    <hr/>
                    <p className='sm:text-xs md:text-xs lg:text-xs xl:text-xs text-left pt-[10px]'>{props.summary}</p>

                    <h4 className='sm:text-base md:text-base lg:text-base xl:text-base text-left roboto pt-[30px]' style={{color:"#5365a3"}}>Skills</h4>
                    <hr/>
                    <div className='text-left pt-[10px]'>
                        {props.skills.map((skill, index)=>(
                            <p key={index} className='sm:text-xs md:text-xs lg:text-xs xl:text-xs px-[5px] border rounded-md mx-[3px]' style={{display:"inline-block"}}>{skill}</p>
                        ))}
                    </div>
                    <h4 className='sm:text-base md:text-base lg:text-base xl:text-base text-left roboto pt-[30px]' style={{color:"#5365a3"}}>Achievements</h4>
                    <hr/>
                    {props.achievements.map((ach, index)=>(
                        <li key={index} className='sm:text-xs md:text-xs lg:text-xs xl:text-xs text-left pt-[10px]'>
                            {ach}
                        </li>
                    )
                    )}


                    <h4 className='sm:text-base md:text-base lg:text-base xl:text-base text-left roboto pt-[30px]' style={{color:"#5365a3"}}>Certifications</h4>
                    <hr/>
                    {props.certification.map((cer, index)=>(
                        <li key={index}  className='sm:text-xs md:text-xs lg:text-xs xl:text-xs text-left pt-[10px]'>
                            {cer}
                        </li>
                    ))}

                </div>

            </div>
            
      </div>
      </div>
    </div>
    <button onClick={downloadPDF} className="bg-blue-600 text-white px-4 py-2 rounded">Download PDF</button>
    <button onClick={Ycoordinate} className="bg-blue-600 text-white px-4 py-2 rounded">Ycoordinate</button>
    <button onClick={Bordercoordinate} className="bg-blue-600 text-white px-4 py-2 rounded">Bcoordinate</button>
    </div>
  )
}

export default OrangeTemplate
