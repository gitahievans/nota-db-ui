/* eslint-disable no-unused-vars */
import { Alert } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconFileText, IconPlus, IconUpload, IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const PDFUploader = () => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    composer: "",
    lyrics: "",
    file: null,
    categories: [],
    year: null
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "https://nota-db.onrender.com/api/categories/"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await response.json();
        console.log("data", data);

        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

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
      formPayload.append("lyrics", formData.lyrics);
      formPayload.append("pdf_file", files[0]);
      formPayload.append("year", +formData.year);

      formPayload.append(
        "categories",
        JSON.stringify(formData.categories.map((name) => ({ name })))
      );

      const response = await fetch("https://nota-db.onrender.com/api/upload/", {
        method: "POST",
        body: formPayload,
      });

      if (!response.ok) {
        throw new Error("Failed to upload file");
      }

      await response.json();

      setFormData({
        title: "",
        composer: "",
        lyrics: "",
        file: null,
        categories: [],
        year: null
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
      navigate("/");
    } catch (error) {
      console.error("Error uploading file:", error);
      setError(error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleCategoryChange = (categoryName) => {
    setFormData((prev) => {
      const updatedCategories = prev.categories.includes(categoryName)
        ? prev.categories.filter((cat) => cat !== categoryName)
        : [...prev.categories, categoryName];
      return { ...prev, categories: updatedCategories };
    });
  };

  const handleNewCategorySubmit = () => {
    if (newCategory.trim()) {
      setFormData((prev) => ({
        ...prev,
        categories: [...prev.categories, newCategory.trim()],
      }));
      setNewCategory("");
      setShowNewCategoryInput(false);
    }
  };

  const years = Array.from(
    { length: new Date().getFullYear() - 1900 + 1 },
    (_, index) => 1900 + index
  );

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-orange-600 mb-2">
          Upload New Music Score
        </h1>
        <h4 className="text-gray-600">Add a new score to the library</h4>
      </div>

      <form onSubmit={handleUpload} className="space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleFileChange}
            placeholder="Title"
            className="w-full p-3 border rounded-md border-orange-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:outline-none"
            required
          />

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Composer
            </label>
            <input
              type="text"
              name="composer"
              value={formData.composer}
              onChange={handleFileChange}
              placeholder="Composer"
              className="w-full p-3 border rounded-md border-orange-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Year Composed
            </label>
            <select
              name="year"
              value={formData.year}
              onChange={handleFileChange}
              className="w-full p-3 bg-white border rounded-md border-orange-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:outline-none"
            >
              <option value="">Select Year</option>
              {years.reverse().map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Lyrics?
            </label>
            <textarea
              name="lyrics"
              value={formData.lyrics}
              onChange={handleFileChange}
              placeholder="Lyrics?"
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

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Categoriesof the Piece
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => handleCategoryChange(category.name)}
                  className={`px-3 py-1 rounded-full text-sm 
                  ${
                    formData.categories.includes(category.name)
                      ? "bg-orange-500 text-white"
                      : "bg-orange-100 text-orange-700"
                  }
                  hover:bg-orange-400 hover:text-white transition-colors`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {showNewCategoryInput ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Enter new category"
                className="flex-1 p-2 border rounded-md border-orange-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleNewCategorySubmit}
                className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
              >
                Add
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowNewCategoryInput(true)}
              className="flex items-center gap-2 text-orange-600 hover:text-orange-700"
            >
              <IconPlus size={16} />
              <span>Add New Category</span>
            </button>
          )}

          {formData.categories.length > 0 && (
            <div className="mt-2">
              <p className="text-sm text-gray-600 mb-2">Selected categories:</p>
              <div className="flex flex-wrap gap-2">
                {formData.categories.map((cat) => (
                  <span
                    key={cat}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm"
                  >
                    {cat}
                    <button
                      type="button"
                      onClick={() => handleCategoryChange(cat)}
                      className="text-orange-500 hover:text-orange-700"
                    >
                      <IconX size={14} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

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
