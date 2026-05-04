import { LuFileUp, LuX } from "react-icons/lu";
import "./FileUpload.css";

export const FileUpload = ({
  label = "Archivo",
  onFileChange,
  file,
  acceptedExtensions = []
}) => {
  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (acceptedExtensions.length > 0) {
        const ext = selectedFile.name.split('.').pop()?.toLowerCase();
        if (!acceptedExtensions.includes(ext)) {
          console.warn(`Extension no permitida: ${ext}`);
          return;
        }
      }
      onFileChange(selectedFile);
    }
  };

  return (
    <div className="file-upload-wrapper">
      <label htmlFor="file-input" className="file-upload-label">
        <div className="file-upload-content">
          <LuFileUp className="file-upload-icon" />
          <div className="file-upload-text-group">
            <p className="file-upload-title">{label}</p>
            <p className="file-upload-hint">PDF, JPG, PNG</p>
          </div>
        </div>
        <input
          id="file-input"
          type="file"
          onChange={handleFileChange}
          className="file-upload-input"
          accept={acceptedExtensions.length > 0 ? acceptedExtensions.map(ext => `.${ext}`).join(',') : undefined}
        />
      </label>
      {file && (
        <div className="file-item">
          <LuFileUp className="file-item-icon" />
          <span className="file-item-name">{file.name}</span>
          <button
            type="button"
            onClick={() => onFileChange(null)}
            className="file-item-remove"
          >
            <LuX />
          </button>
        </div>
      )}
    </div>
  );
};