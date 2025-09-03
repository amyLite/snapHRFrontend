import { useEffect, useRef, useState } from "react";

const AutoPaginateText = ({ text, maxHeight = '60vw' }) => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [pages, setPages] = useState([]);
  const divRef = useRef(null);

  useEffect(() => {
    const splitTextIntoPages = () => {
      if (!divRef.current) return;
      
      let words = text.split(" ");
      let tempPages = [];
      let currentText = "";
      
      const tempDiv = document.createElement("div");
      tempDiv.style.position = "absolute";
      tempDiv.style.visibility = "hidden";
      tempDiv.style.width = divRef.current.clientWidth + "px";
      tempDiv.style.height = "auto";
      tempDiv.style.font = getComputedStyle(divRef.current).font;
      document.body.appendChild(tempDiv);

      words.forEach((word) => {
        tempDiv.innerText = currentText + " " + word;
        if (tempDiv.clientHeight > maxHeight) {
          tempPages.push(currentText);
          currentText = word;
        } else {
          currentText += " " + word;
        }
      });

      if (currentText) tempPages.push(currentText);
      
      document.body.removeChild(tempDiv);
      setPages(tempPages);
    };

    splitTextIntoPages();
  }, [text, maxHeight]);

  return (
    <div className="flex flex-col gap-4">
      {pages.map((page, index) => (
        <div
          key={index}
          ref={index === 0 ? divRef : null}
          className="w-full max-w-lg border p-4 shadow-md bg-white"
          style={{ maxHeight, overflow: "hidden" }}
        >
          {page}
        </div>
      ))}
    </div>
  );
};

export default AutoPaginateText;
