import React, { useState } from 'react';
import axios from 'axios';
import download_icon_black from '../assets/download_icon_black.png'

const ExcelDownloader = () => {

  const [isDownloaded, setIsDownloaded] = useState(false);

  const handleDownload = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/download-excel/", {
        responseType: "blob",
      });

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = "resumes.xlsx";
      link.click();
      setIsDownloaded(true);
    } catch (error) {
      console.error("Download failed", error);
      alert("Something went wrong while downloading.");
    }
  };

  return (
    <>
    {isDownloaded ? <h2>File downloaded sucessfully</h2> : 
      <button
      onClick={handleDownload}
      className="flex items-center gap-2 text-xs bg-white border-black font-bold hover:bg-gray-200 hover:border-black px-4 py-2 rounded whitespace-nowrap"
    >
      <img src={download_icon_black} className='w-[12px]'/> Export
    </button>
    }
    </>

  );
};

export default ExcelDownloader;
