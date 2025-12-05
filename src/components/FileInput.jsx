import { useRef } from 'react';

function FileInput({ label, onFileSelected, selectedFile }) {
  const fileInputRef = useRef(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      if (allowedTypes.includes(file.type)) {
        onFileSelected(file);
      } else {
        alert('Зөвхөн jpg, jpeg, png, pdf файл сонгоно уу');
      }
    }
  };

  return (
    <div className="input-group">
      <label>{label}</label>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".jpg,.jpeg,.png,.pdf"
        style={{ display: 'none' }}
      />
      <div className="file-input-box" onClick={handleClick}>
        <span className={selectedFile ? 'file-name' : 'placeholder'}>
          {selectedFile?.name || 'Файл сонгох'}
        </span>
        <span className="upload-icon">📤</span>
      </div>
    </div>
  );
}

export default FileInput;
