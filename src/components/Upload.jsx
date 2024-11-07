/* eslint-disable no-unused-vars */
import { Alert } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconFileText, IconUpload, IconX } from "@tabler/icons-react";
import { useState } from "react";

const PDFUploader = () => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    composer: "",
    description: "",
    file: null,
  });

  const handleFileChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDrop = (acceptedFiles) => {
    const pdfFiles = acceptedFiles.filter(
      (file) => file.type === "application/pdf"
    );

    if (pdfFiles.length !== acceptedFiles.length) {
      setError("Only PDF files can be uploaded.");
      return;
    }

    setFiles([pdfFiles[0]]);
    setError(null);
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (files.length === 0) {
      setError("Please select a PDF file.");
      return;
    }

    if (!formData.title.trim()) {
      setError("Please enter a title.");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const formPayload = new FormData();
      formPayload.append("title", formData.title);
      formPayload.append("composer", formData.composer);
      formPayload.append("description", formData.description);
      formPayload.append("pdf_file", files[0]); // Only the first file is uploaded

      const response = await fetch("http://127.0.0.1:8000/api/upload/", {
        method: "POST",
        body: formPayload,
        // Do not set the Content-Type header manually; fetch will handle it
      });

      if (!response.ok) {
        throw new Error("Failed to upload file");
      }

      await response.json();

      setFormData({
        title: "",
        composer: "",
        description: "",
        file: null,
      });
      setFiles([]);
      notifications.show({
        title: "Success",
        message: "File uploaded successfully",
        color: "green",
        icon: <IconUpload />,
        position: "top-center",
      });
      setUploading(false);
    } catch (error) {
      console.error("Error uploading file:", error);
      setError(error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-orange-600 mb-2">
          Upload New PDF
        </h1>
        <h4 className="text-gray-600">Add a new PDF to your library</h4>
      </div>

      <form onSubmit={handleUpload} className="space-y-6">
        <div className="space-y-4">
          <div>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleFileChange}
              placeholder="Title"
              className="w-full p-3 border rounded-md border-orange-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <input
              type="text"
              name="composer"
              value={formData.composer}
              onChange={handleFileChange}
              placeholder="Composer"
              className="w-full p-3 border rounded-md border-orange-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
          </div>

          <div>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleFileChange}
              placeholder="Description"
              rows={3}
              className="w-full p-3 border rounded-md border-orange-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
          </div>

          <div
            className={`border-2 border-dashed rounded-lg p-6 cursor-pointer
            ${
              files.length
                ? "border-orange-500 bg-orange-50"
                : "border-gray-300"
            }
            ${error ? "border-red-500 bg-red-50" : ""}
            hover:border-orange-500 transition-colors`}
            onDrop={(e) => {
              e.preventDefault();
              const droppedFiles = Array.from(e.dataTransfer.files);
              handleDrop(droppedFiles);
            }}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => {
              const input = document.createElement("input");
              input.type = "file";
              input.multiple = true;
              input.accept = "application/pdf";
              input.onchange = (e) => handleDrop(Array.from(e.target.files));
              input.click();
            }}
          >
            <div className="flex flex-col items-center space-y-4">
              {files.length ? (
                <IconFileText size={52} className="text-orange-500" />
              ) : (
                <IconUpload size={52} className="text-gray-400" />
              )}

              <div className="text-center">
                <p className="text-xl">
                  {files.length
                    ? `${files.length} file${
                        files.length === 1 ? "" : "s"
                      } selected`
                    : "Drag a PDF file here or click to select"}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Maximum file size: 5MB
                </p>
              </div>
            </div>
          </div>

          {files.length > 0 && (
            <div className="space-y-2">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-orange-50 rounded-md"
                >
                  <span className="text-sm text-gray-600">{file.name}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFiles(files.filter((_, i) => i !== index));
                    }}
                    className="text-gray-500 hover:text-red-500"
                  >
                    <IconX size={20} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <Alert.Circle className="h-4 w-4" />
              <Alert.Description>{error}</Alert.Description>
            </Alert>
          )}

          {success && (
            <Alert className="bg-green-50 border-green-500">
              <Alert.Description className="text-green-700">
                Files uploaded successfully!
              </Alert.Description>
            </Alert>
          )}

          <button
            type="submit"
            disabled={uploading}
            className={`w-full flex items-center justify-center space-x-2 p-3 rounded-md text-white
            ${
              uploading
                ? "bg-orange-400 cursor-not-allowed"
                : "bg-orange-600 hover:bg-orange-700"
            }
            transition-colors`}
          >
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <IconUpload size={20} />
                <span>Upload</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PDFUploader;
