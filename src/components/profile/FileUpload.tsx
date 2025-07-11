import React from "react";

interface FileUploadProps {
  file?: File;
  onFileChange?: (file: File) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ file, onFileChange }) => {
  return (
    <div className="border rounded p-3 flex items-center gap-3">
      <button className="bg-gray-100 px-3 py-1 rounded text-sm">Upload File</button>
      {file && <span className="text-gray-600 text-sm">{file.name}</span>}
    </div>
  );
};

export default FileUpload; 