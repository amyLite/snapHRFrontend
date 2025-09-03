import React, { useState } from "react";

const SaveDailogueBox = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");

  const handleSave = () => {
    console.log("Saved Name:", name);
    setIsModalOpen(false);
    setName("");
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setName("");
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      {/* Background Content */}
      <div className={`${isModalOpen ? "blur-sm" : ""} transition-all duration-300`}>
        <button 
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => setIsModalOpen(true)}
        >
          Open Modal
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center z-50">
          {/* Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>

          {/* Modal Content */}
          <div className="relative bg-white p-6 rounded-lg shadow-lg w-80 z-10">
            <h2 className="text-lg font-semibold mb-4">Enter Name</h2>
            <input 
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mb-4"
              placeholder="Enter your name"
            />
            <div className="flex justify-end gap-2">
              <button 
                onClick={handleClose}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded"
              >
                Close
              </button>
              <button 
                onClick={handleSave}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SaveDailogueBox;
