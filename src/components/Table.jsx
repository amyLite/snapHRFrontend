import React, { useState } from 'react'
import ExcelDownloader from './DownloadExcel'
import SaveDailogueBox from './SaveDailogueBox'
import axios from 'axios';
import tick from '../assets/tick.svg'
import spin from '../assets/spin.png'

const Table = ({props, flag}) => {

    const [sortOrder, setSortOrder] = useState('asc');
    const [sortOrderExp, setSortOrderExp] = useState('asc');
    const [data, setData] = useState(props);
    const [expandedRowIndex, setExpandedRowIndex] = useState(null);
    const [reportName, setReportName] = useState("");
    const [DilogBox, setDilogBox] = useState(false);
    const [saveToDashbord, setSaveToDashbord] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const sortByScore = () => {
        const sorted = [...data].sort((a, b) =>
          sortOrder === 'asc' ? a.score - b.score : b.score - a.score
        );
        setData(sorted);
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
      };
    
    const sortByScoreExp = () => {
        const sorted = [...data].sort((a, b) =>
          sortOrderExp === 'asc' ? a.score - b.score : b.score - a.score
        );
        setData(sorted);
        setSortOrderExp(sortOrderExp === 'asc' ? 'desc' : 'asc');
      };

    const handleSaveToDashbord = async (reportName) => {
        setIsSaving(true);
        const saveReport = await axios.post("http://127.0.0.1:8000/push-report/", {
          repo_name: reportName,
          report: data
        });
        setIsSaving(false);
        setSaveToDashbord(true);
        
        return saveReport
      }

  return (

    <div className='mx-4'>
        
        <input type="text" placeholder='Untiteled Report' value={reportName} onChange={(e)=>setReportName(e.target.value)} 
        className='justify-start flex text-gray-600 text-left text-lg font-inter font-semibold p-1 bg-white border border-gray-300 rounded-md focus:outline-none focus:border-violet-600'/> 

        <div className='w-full text-right pb-4 justify-end flex gap-2'>
          {!saveToDashbord ?
          <button 
          className='flex items-center gap-2 text-xs bg-white border-black font-bold hover:bg-gray-200 hover:border-black px-4 py-2 rounded whitespace-nowrap transition-all ease-in duration-300'
          onClick={()=>handleSaveToDashbord(reportName)}>
            Save to Dashbord
          </button> 
          :
          <>
          {isSaving ? <div className='flex items-center gap-4'>
            <img src={spin} className='w-10 animate-spin transition-all ease-in duration-300'/> </div>
                                           
          :
          <div className='flex items-center gap-2 text-teal-500 text-sm bg-white font-bold px-3 py-2 rounded whitespace-nowrap transition-all ease-in duration-300'>
            <img src={tick} className='w-4'/> Saved
          </div>
          }
          </>
          }


          <>
            <ExcelDownloader/>
          </>
        </div>
        
        <table className="min-w-full text-sm text-left overflow-hidden">
      <thead className='text-white whitespace-nowrap'>
        <tr className="bg-violet-500 font-bold">
          <th className="px-4 py-3 rounded-l-lg">Name</th>
          <th className="px-4 py-3 ">Email</th>
          <th className="px-4 py-3 ">Phone</th>
          <th className="px-4 py-3 ">Location</th>
          <th className="px-4 py-3 ">Skills</th>
          <th className="px-4 py-3 w-[500px]">Summary</th>
          <th className="px-4 py-3 cursor-pointer" onClick={sortByScore}>
            Score {sortOrder === 'asc' ? '↑' : '↓'}
          </th>
          <th className="px-4 py-3 cursor-pointer rounded-r-lg" onClick={sortByScoreExp}>
            Total Exp {sortOrderExp === 'asc' ? '↑' : '↓'}
          </th>
        </tr>
      </thead>
      <tbody className='bg-white text-gray-800'>

        {data.map((item, index) => (
          <tr onClick={() => setExpandedRowIndex(expandedRowIndex === index ? null:index)} key={index} className="border-b last:border-none hover:bg-violet-100 text-xs cursor-pointer ease-in transition-all duration-100">
            <td className="px-4 py-3 font-bold">{item.name}</td>
            <td className="px-4 py-3 font-medium">{item.email}</td>
            <td className="px-4 py-3 font-medium">{item.phone}</td>
            <td className="px-4 py-3 font-medium">{item.location}</td>
            {/* <td className="px-4 py-2 w-[300px] max-w-[300px] whitespace-normal break-words font-bold">{item.skills.join(', ')}</td> */}
            <td className="px-4 py-2 w-[300px] max-w-[300px] whitespace-normal break-words font-bold">
              <ul>

                  {(Array.isArray(item.skills) ? item.skills : (item.skills ? String(item.skills).split(/[,;]+/) : [])).map((it, index) => (
                        <li key={index} className="text-xs font-medium bg-teal-100 m-1 p-1 inline-block border border-teal-300 rounded-md">{it.trim()}</li>
                  ))
                  }
              </ul>
            </td>
            <td className={` px-4 py-2 w-[300px] max-w-[300px] italic overflow-hidden whitespace-normal break-words col-span-1 text-sm text-gray-700 ease-in transition-all duration-300 ${
            expandedRowIndex === index ? "line-clamp-none max-h-full" : "line-clamp-2 max-h-[3.2rem]"
          }`}
            >{item.summary}</td>
             {/* Progress Bar */}
            <td className="px-4 py-4">
              <div className="flex items-center gap-2">
                <div className="w-full bg-gray-200 rounded h-2">
                  <div
                    className="bg-violet-500 h-2 rounded"
                    style={{ width: `${item.score*10}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-gray-600">{item.score}</span>
              </div>
            </td>
            {/* <td className="px-4 py-3 font-medium">{item.score}</td> */}
            <td className="px-4 py-3 font-medium">{item.total_experience}</td>
          </tr>
        ))}
      </tbody>
    </table>
      
    </div>

  )
}

export default Table
