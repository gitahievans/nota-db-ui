/* eslint-disable no-unused-vars */
import React from "react";
import { Modal } from "@mantine/core";
import {
  IconUser,
  IconCalendar,
  IconMusic,
  IconDownload,
  IconX,
} from "@tabler/icons-react";

const PDFDetailModal = ({ pdf, opened, close }) => {
  const handleDownload = (e) => {
    e.stopPropagation();
    // Your download logic here
  };

  const toTitleCase = (str) => {
    return str.replace(
      /\w\S*/g,
      (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  };

  return (
    <Modal
      opened={opened}
      onClose={close}
      size="lg"
      padding="xl"
      centered
      withCloseButton={false}
    >
      <div className="relative">
        <button
          onClick={close}
          className="absolute right-0 top-0 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <IconX size={20} className="text-gray-500" />
        </button>

        <div className="space-y-6 pt-2">
          {/* Header Section */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">
              {toTitleCase(pdf.title)}
            </h2>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 bg-orange-100 rounded-full">y
                  <IconUser size={16} className="text-orange-600" />
                </div>
                <span className="text-sm font-medium text-gray-600">
                  {pdf.composer}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <div className="p-1.5 bg-orange-100 rounded-full">
                  <IconCalendar size={16} className="text-orange-600" />
                </div>
                <span className="text-sm font-medium text-gray-600">
                  {pdf.uploaded_at || "No date available"}
                </span>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="space-y-4">
            <div className="bg-orange-50 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Lyrics
              </h3>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                {pdf.lyrics}
              </p>
            </div>
          </div>

          {/* Footer Action */}
          <div className="flex justify-end pt-4">
            <button
              onClick={handleDownload}
              className="flex items-center space-x-2 px-4 py-2 bg-orange-100 
                       text-orange-600 font-medium rounded-lg hover:bg-orange-200 
                       active:scale-95 transition-all duration-300"
            >
              <IconDownload size={18} />
              <span>Download PDF</span>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default PDFDetailModal;
