/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";

import PDFCard from "./PDFCard";

const Home = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/files");
        if (!response.ok) {
          throw new Error("Failed to fetch files");
        }
        const data = await response.json();
        setFiles(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching PDFs:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchFiles();
  }, []);

  console.log("Files:", files);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <div className="text-red-500 text-xl mb-4">Error loading PDFs</div>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8 mb-12">
        <h1 className="text-4xl font-bold text-gray-900 ">PDF Library</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {files.map((file) => (
          <PDFCard
            key={file.id}
            pdf={file}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
