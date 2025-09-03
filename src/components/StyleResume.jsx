import React, { useRef } from "react";
import { FaEnvelope, FaGlobe, FaMapMarkerAlt, FaPhone } from "react-icons/fa";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { Document, Packer, Paragraph, TextRun } from "docx";



export default function StyledResume() {
    const resumeRef = useRef(null);


    const downloadPDF = async () => {
        const input = resumeRef.current;
        if (!input) return;
      
        const canvas = await html2canvas(input, {
          scale: 2,
          useCORS: true,
          scrollX: 0,
          scrollY: 0,
          windowWidth: document.documentElement.offsetWidth,
          windowHeight: document.documentElement.offsetHeight,
        });
      
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const imgWidth = 190;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
        pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
        pdf.save("resume.pdf");
      };

    const downloadDOCX = () => {
        const doc = new Document({
          sections: [
            {
              properties: {},
              children: [
                new Paragraph({
                  children: [
                    new TextRun("JOHN DOE\n"),
                    new TextRun("Application Support Engineer\n\n"),
                    new TextRun("EXPERIENCE\n"),
                    new TextRun("Lead Application Support Engineer - Innovative Tech Solutions\n"),
                    new TextRun("Managed application support, reducing response times by 40%.\n\n"),
                    new TextRun("SUMMARY\n"),
                    new TextRun(
                      "Experienced Application Support Engineer with 7+ years in managing software applications.\n"
                    ),
                  ],
                }),
              ],
            },
          ],
        });
    
        Packer.toBlob(doc).then((blob) => {
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "resume.docx";
          a.click();
          URL.revokeObjectURL(url);
        });
      };

  return (
    <div>
       <div className="max-w-4xl mx-auto bg-white shadow-lg p-8 rounded-lg border border-gray-300" ref={resumeRef}>
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">JOHN DOE</h1>
          <h2 className="text-xl text-blue-600 font-semibold">Application Support Engineer</h2>
          <p className="text-gray-600">
            📍 New York, NY | 📧 john.doe@email.com | 🌐 www.johndoeportfolio.com
          </p>
        </div>
        <div className="w-16 h-16 bg-blue-600 text-white flex items-center justify-center text-xl font-bold rounded-full">
          JD
        </div>
      </div>

      {/* Two-Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {/* Left Column */}
        <div className="md:col-span-1 space-y-6">
          {/* Summary */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 border-b pb-2">Summary</h2>
            <p className="text-gray-700 text-sm mt-2">
              Experienced Application Support Engineer with 7+ years of expertise in managing software applications, 
              providing technical support, and optimizing system performance.
            </p>
          </div>

          {/* Certifications */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 border-b pb-2">Certifications</h2>
            <ul className="list-disc list-inside text-gray-700 text-sm mt-2">
              <li>Certified AWS Solutions Architect</li>
              <li>Certified Java Programmer</li>
              <li>Certified ITIL Foundation</li>
            </ul>
          </div>

          {/* Achievements */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 border-b pb-2">Key Achievements</h2>
            <ul className="list-disc list-inside text-gray-700 text-sm mt-2">
              <li>🏆 2023 Outstanding Application Support Award</li>
              <li>🎤 Featured Speaker, 2022 Software Reliability Summit</li>
            </ul>
          </div>

          {/* Skills */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 border-b pb-2">Skills</h2>
            <div className="flex flex-wrap gap-2 mt-2">
              {[
                "AWS", "AWS Lambda", "Azure", "DevOps", "CloudWatch", "EC2",
                "ITIL", "Java", "Spring Boot", "Linux", "NoSQL", "SQL"
              ].map((skill, index) => (
                <span key={index} className="bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="md:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 border-b pb-2">Experience</h2>

          {/* Job 1 */}
          <div>
            <h3 className="text-lg font-semibold">Lead Application Support Engineer</h3>
            <p className="text-blue-600">Innovative Tech Solutions</p>
            <p className="text-gray-600 text-sm">📅 04/2021 - Present | 📍 New York, NY</p>
            <ul className="list-disc list-inside text-gray-700 text-sm mt-2">
              <li>Led troubleshooting for app-related issues, reducing resolution time by 40%.</li>
              <li>Provided technical support & training, enhancing customer satisfaction by 30%.</li>
              <li>Deployed software patches, ensuring 100% system uptime.</li>
            </ul>
          </div>

          {/* Job 2 */}
          <div>
            <h3 className="text-lg font-semibold">Senior Application Support Engineer</h3>
            <p className="text-blue-600">Creative Tech Agency</p>
            <p className="text-gray-600 text-sm">📅 06/2016 - 03/2021 | 📍 Los Angeles, CA</p>
            <ul className="list-disc list-inside text-gray-700 text-sm mt-2">
              <li>Orchestrated technical operations, improving user experience by 15%.</li>
              <li>Implemented proactive monitoring tools for early issue detection.</li>
            </ul>
          </div>

          {/* Job 3 */}
          <div>
            <h3 className="text-lg font-semibold">Application Support Engineer</h3>
            <p className="text-blue-600">Tech Solutions Innovations</p>
            <p className="text-gray-600 text-sm">📅 01/2015 - 05/2016 | 📍 San Francisco, CA</p>
            <ul className="list-disc list-inside text-gray-700 text-sm mt-2">
              <li>Provided front-line technical support for end-users.</li>
              <li>Collaborated with development teams for issue resolution.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <button onClick={downloadPDF} className="bg-blue-600 text-white px-4 py-2 rounded">Download PDF</button>
    <button onClick={downloadDOCX} className="bg-green-600 text-white px-4 py-2 rounded">Download DOCX</button>
    </div>
  );
}